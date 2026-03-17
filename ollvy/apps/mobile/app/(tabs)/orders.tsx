import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { formatPaisa } from '@ollvy/shared';

interface Order {
  id: string;
  status: string;
  total_paisa_snapshot: number;
  created_at: string;
  completed_at: string | null;
  service_packages: {
    id: string;
    name: string;
    slug: string;
  };
  professionals?: {
    id: string;
    display_name: string;
  } | null;
}

interface RetainerSubscription {
  id: string;
  status: string;
  billing_cycle: string;
  monthly_price_paisa: number;
  is_trial_active: boolean;
  started_at: string;
  next_billing_date: string | null;
  service_packages: {
    id: string;
    name: string;
    tier_label: string | null;
  };
  professionals?: {
    id: string;
    display_name: string;
  } | null;
}

type TabType = 'active' | 'completed' | 'retainers';

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending_payment: { label: 'Pending Payment', color: '#D97706', bgColor: '#FEF3C7' },
  paid: { label: 'Processing', color: '#2563EB', bgColor: '#DBEAFE' },
  assigned: { label: 'Assigned', color: '#7C3AED', bgColor: '#EDE9FE' },
  waitlisted: { label: 'Finding Expert', color: '#6B7280', bgColor: '#F3F4F6' },
  in_progress: { label: 'In Progress', color: '#059669', bgColor: '#D1FAE5' },
  completed: { label: 'Completed', color: '#10B981', bgColor: '#D1FAE5' },
  cancelled: { label: 'Cancelled', color: '#DC2626', bgColor: '#FEE2E2' },
  refunded: { label: 'Refunded', color: '#6B7280', bgColor: '#F3F4F6' },
};

const RETAINER_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  onboarding: { label: 'Setting Up', color: '#D97706', bgColor: '#FEF3C7' },
  active: { label: 'Active', color: '#059669', bgColor: '#D1FAE5' },
  paused: { label: 'Paused', color: '#9333EA', bgColor: '#F3E8FF' },
  payment_failed: { label: 'Payment Failed', color: '#DC2626', bgColor: '#FEE2E2' },
  cancelled: { label: 'Cancelled', color: '#6B7280', bgColor: '#F3F4F6' },
};

export default function OrdersScreen() {
  const { user, session } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [retainers, setRetainers] = useState<RetainerSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;

    try {
      if (activeTab === 'retainers') {
        // Fetch retainer subscriptions
        const { data, error } = await supabase
          .from('retainer_subscriptions')
          .select(`
            id,
            status,
            billing_cycle,
            monthly_price_paisa,
            is_trial_active,
            started_at,
            next_billing_date,
            service_packages!inner (id, name, tier_label),
            professionals (id, display_name)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching retainers:', error);
          return;
        }

        // Transform Supabase array data to single objects
        const transformed = (data || []).map((item: any) => ({
          ...item,
          service_packages: Array.isArray(item.service_packages) ? item.service_packages[0] : item.service_packages,
          professionals: Array.isArray(item.professionals) ? item.professionals[0] || null : item.professionals,
        }));
        setRetainers(transformed);
      } else {
        // Fetch orders
        let query = supabase
          .from('orders')
          .select(`
            id,
            status,
            total_paisa_snapshot,
            created_at,
            completed_at,
            service_packages!inner (id, name, slug),
            professionals (id, display_name)
          `)
          .eq('user_id', user.id)
          .is('retainer_subscription_id', null) // Exclude child orders from retainers
          .order('created_at', { ascending: false });

        // Filter by tab
        if (activeTab === 'active') {
          query = query.in('status', ['pending_payment', 'paid', 'assigned', 'waitlisted', 'in_progress']);
        } else {
          query = query.in('status', ['completed', 'cancelled', 'refunded']);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching orders:', error);
          return;
        }

        // Transform Supabase array data to single objects
        const transformed = (data || []).map((item: any) => ({
          ...item,
          service_packages: Array.isArray(item.service_packages) ? item.service_packages[0] : item.service_packages,
          professionals: Array.isArray(item.professionals) ? item.professionals[0] || null : item.professionals,
        }));
        setOrders(transformed);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id, activeTab]);

  // Fetch orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchOrders();
    }, [fetchOrders])
  );

  // Refetch when tab changes
  useEffect(() => {
    setIsLoading(true);
    fetchOrders();
  }, [activeTab, fetchOrders]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const formatPrice = (paisa: number): string => {
    return formatPaisa(paisa);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderOrderCard = ({ item }: { item: Order }) => {
    const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending_payment;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => router.push(`/order/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {item.service_packages.name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Date</Text>
            <Text style={styles.detailValue}>{formatDate(item.created_at)}</Text>
          </View>

          {item.professionals && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expert</Text>
              <Text style={styles.detailValue}>{item.professionals.display_name}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={styles.priceValue}>{formatPrice(item.total_paisa_snapshot)}</Text>
          </View>
        </View>

        <View style={styles.viewDetailsRow}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Text style={styles.arrow}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRetainerCard = ({ item }: { item: RetainerSubscription }) => {
    const statusConfig = RETAINER_STATUS_CONFIG[item.status] || RETAINER_STATUS_CONFIG.active;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => router.push(`/retainer/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <View style={styles.retainerTitleRow}>
            <Text style={styles.serviceName} numberOfLines={1}>
              {item.service_packages.name}
            </Text>
            {item.service_packages.tier_label && (
              <View style={styles.tierBadge}>
                <Text style={styles.tierBadgeText}>{item.service_packages.tier_label}</Text>
              </View>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {item.is_trial_active && (
          <View style={styles.trialIndicator}>
            <Text style={styles.trialIndicatorText}>Free Trial Active</Text>
          </View>
        )}

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Started</Text>
            <Text style={styles.detailValue}>{formatDate(item.started_at)}</Text>
          </View>

          {item.professionals && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expert</Text>
              <Text style={styles.detailValue}>{item.professionals.display_name}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {item.billing_cycle === 'quarterly' ? 'Quarterly' : 'Monthly'}
            </Text>
            <Text style={styles.priceValue}>{formatPrice(item.monthly_price_paisa)}/mo</Text>
          </View>

          {item.next_billing_date && item.status === 'active' && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next Billing</Text>
              <Text style={styles.detailValue}>{formatDate(item.next_billing_date)}</Text>
            </View>
          )}
        </View>

        <View style={styles.viewDetailsRow}>
          <Text style={styles.viewDetailsText}>Manage Subscription</Text>
          <Text style={styles.arrow}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    let title = 'No Active Orders';
    let text = 'Your active orders will appear here once you place an order.';
    let showButton = true;

    if (activeTab === 'completed') {
      title = 'No Completed Orders';
      text = 'Your completed orders will appear here.';
      showButton = false;
    } else if (activeTab === 'retainers') {
      title = 'No Subscriptions';
      text = 'Your monthly compliance subscriptions will appear here.';
      showButton = true;
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyText}>{text}</Text>
        {showButton && (
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.browseButtonText}>Browse Services</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Orders</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Sign in to view orders</Text>
          <Text style={styles.emptyText}>
            Please sign in to see your orders.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'retainers' && styles.activeTab]}
          onPress={() => setActiveTab('retainers')}
        >
          <Text style={[styles.tabText, activeTab === 'retainers' && styles.activeTabText]}>
            Retainers
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : activeTab === 'retainers' ? (
        <FlatList
          data={retainers}
          keyExtractor={(item) => item.id}
          renderItem={renderRetainerCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#2563EB']}
              tintColor="#2563EB"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#2563EB']}
              tintColor="#2563EB"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 24,
    paddingTop: 12,
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  retainerTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  tierBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  trialIndicator: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  trialIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 14,
    color: '#2563EB',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
