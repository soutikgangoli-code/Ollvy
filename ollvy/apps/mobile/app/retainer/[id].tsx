// U18 Retainer Detail Screen
// Spec:
// - Show retainer status, assigned professional, monthly price
// - Persistent chat panel (links to /retainer/[id]/chat)
// - Current cycle info, billing history
// - Actions: Pause, Change Tier, Cancel

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { supabase, getEdgeFunctionUrl } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { formatPaisa } from '@ollvy/shared';

interface RetainerDetail {
  id: string;
  status: string;
  billing_cycle: string;
  monthly_price_paisa: number;
  is_trial_active: boolean;
  pause_count: number;
  started_at: string;
  next_billing_date: string | null;
  pause_start_date: string | null;
  cancelled_at: string | null;
  cancelled_effective_date: string | null;
  service_packages: {
    id: string;
    name: string;
    tier_label: string | null;
    tier_group_id: string | null;
    short_description: string;
  };
  professionals: {
    id: string;
    display_name: string;
  } | null;
  chat_conversation_id: string | null;
}

interface BillingEvent {
  id: string;
  event_type: string;
  billing_period: string;
  amount_paisa: number;
  status: string;
  processed_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  onboarding: { label: 'Setting Up', color: '#D97706', bgColor: '#FEF3C7' },
  active: { label: 'Active', color: '#059669', bgColor: '#D1FAE5' },
  paused: { label: 'Paused', color: '#9333EA', bgColor: '#F3E8FF' },
  payment_failed: { label: 'Payment Failed', color: '#DC2626', bgColor: '#FEE2E2' },
  cancelled: { label: 'Cancelled', color: '#6B7280', bgColor: '#F3F4F6' },
};

function formatPrice(paisa: number): string {
  return formatPaisa(paisa);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RetainerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuthStore();

  const [retainer, setRetainer] = useState<RetainerDetail | null>(null);
  const [billingEvents, setBillingEvents] = useState<BillingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRetainer = useCallback(async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('retainer_subscriptions')
        .select(`
          id,
          status,
          billing_cycle,
          monthly_price_paisa,
          is_trial_active,
          pause_count,
          started_at,
          next_billing_date,
          pause_start_date,
          cancelled_at,
          cancelled_effective_date,
          chat_conversation_id,
          service_packages!inner (id, name, tier_label, tier_group_id, short_description),
          professionals (id, display_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      // Transform Supabase array data to single objects
      const transformed: RetainerDetail = {
        ...data,
        service_packages: Array.isArray(data.service_packages) ? data.service_packages[0] : data.service_packages,
        professionals: Array.isArray(data.professionals) ? data.professionals[0] || null : data.professionals,
      };
      setRetainer(transformed);

      // Fetch billing events
      const { data: events } = await supabase
        .from('retainer_billing_events')
        .select('id, event_type, billing_period, amount_paisa, status, processed_at')
        .eq('retainer_subscription_id', id)
        .order('processed_at', { ascending: false })
        .limit(10);

      setBillingEvents(events || []);
    } catch (err) {
      console.error('Error fetching retainer:', err);
      Alert.alert('Error', 'Failed to load subscription details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRetainer();
  }, [fetchRetainer]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRetainer();
  };

  const handlePause = async () => {
    if (!retainer) return;

    if (retainer.pause_count >= 2) {
      Alert.alert(
        'Pause Limit Reached',
        'You can only pause your subscription 2 times per year. Please contact support for assistance.'
      );
      return;
    }

    Alert.alert(
      'Pause Subscription',
      `Are you sure you want to pause your ${retainer.service_packages.name} subscription? You can pause for up to 1 month. You have ${2 - retainer.pause_count} pause(s) remaining this year.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pause',
          style: 'destructive',
          onPress: async () => {
            setActionLoading('pause');
            try {
              const response = await fetch(getEdgeFunctionUrl('pause-retainer'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ retainer_subscription_id: id }),
              });

              const data = await response.json();

              if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Failed to pause subscription');
              }

              Alert.alert('Subscription Paused', 'Your subscription has been paused. It will automatically resume after 30 days or you can resume it manually.');
              fetchRetainer();
            } catch (err: any) {
              Alert.alert('Error', err.message);
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleResume = async () => {
    Alert.alert(
      'Resume Subscription',
      'Are you sure you want to resume your subscription?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resume',
          onPress: async () => {
            setActionLoading('resume');
            try {
              const response = await fetch(getEdgeFunctionUrl('resume-retainer'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ retainer_subscription_id: id }),
              });

              const data = await response.json();

              if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Failed to resume subscription');
              }

              Alert.alert('Subscription Resumed', 'Your subscription is now active again.');
              fetchRetainer();
            } catch (err: any) {
              Alert.alert('Error', err.message);
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Subscription', headerBackTitle: 'Back' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!retainer) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Error', headerBackTitle: 'Back' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Subscription not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = STATUS_CONFIG[retainer.status] || STATUS_CONFIG.active;
  const canPause = retainer.status === 'active' && !retainer.is_trial_active;
  const canResume = retainer.status === 'paused';
  const canChangeTier = (retainer.status === 'active' || retainer.status === 'paused') && retainer.service_packages.tier_group_id;
  const canCancel = retainer.status !== 'cancelled';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: retainer.service_packages.name,
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" />
        }
      >
        {/* Status Section */}
        <View style={styles.section}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
            {retainer.is_trial_active && (
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>Free Trial</Text>
              </View>
            )}
          </View>

          <Text style={styles.serviceName}>{retainer.service_packages.name}</Text>
          {retainer.service_packages.tier_label && (
            <Text style={styles.tierLabel}>{retainer.service_packages.tier_label} Plan</Text>
          )}
          <Text style={styles.serviceDescription}>{retainer.service_packages.short_description}</Text>
        </View>

        {/* Billing Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monthly Price</Text>
            <Text style={styles.infoValue}>{formatPrice(retainer.monthly_price_paisa)}/mo</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Billing Cycle</Text>
            <Text style={styles.infoValue}>
              {retainer.billing_cycle === 'quarterly' ? 'Quarterly' : 'Monthly'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Started</Text>
            <Text style={styles.infoValue}>{formatDate(retainer.started_at)}</Text>
          </View>

          {retainer.next_billing_date && retainer.status === 'active' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Next Billing</Text>
              <Text style={styles.infoValue}>{formatDate(retainer.next_billing_date)}</Text>
            </View>
          )}

          {retainer.pause_start_date && retainer.status === 'paused' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Paused Since</Text>
              <Text style={styles.infoValue}>{formatDate(retainer.pause_start_date)}</Text>
            </View>
          )}

          {retainer.cancelled_effective_date && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ends On</Text>
              <Text style={styles.infoValueWarning}>{formatDate(retainer.cancelled_effective_date)}</Text>
            </View>
          )}
        </View>

        {/* Professional */}
        {retainer.professionals && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Expert</Text>
            <View style={styles.professionalCard}>
              <View style={styles.professionalAvatar}>
                <Text style={styles.avatarText}>
                  {retainer.professionals.display_name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.professionalInfo}>
                <Text style={styles.professionalName}>{retainer.professionals.display_name}</Text>
                <Text style={styles.professionalLabel}>Dedicated Expert</Text>
              </View>
            </View>
          </View>
        )}

        {/* Chat Button */}
        {retainer.chat_conversation_id && retainer.status !== 'cancelled' && (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => router.push(`/retainer/${id}/chat`)}
          >
            <Text style={styles.chatButtonText}>Open Chat</Text>
            <Text style={styles.chatButtonArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Billing History */}
        {billingEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Billing History</Text>
            {billingEvents.map((event) => (
              <View key={event.id} style={styles.billingEventRow}>
                <View>
                  <Text style={styles.billingEventType}>
                    {event.event_type === 'subscription.charged' ? 'Payment' : event.event_type}
                  </Text>
                  <Text style={styles.billingEventDate}>{formatDate(event.processed_at)}</Text>
                </View>
                <Text style={styles.billingEventAmount}>
                  {event.amount_paisa ? formatPrice(event.amount_paisa) : '-'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        {retainer.status !== 'cancelled' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage</Text>

            {canPause && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePause}
                disabled={actionLoading === 'pause'}
              >
                {actionLoading === 'pause' ? (
                  <ActivityIndicator size="small" color="#4F46E5" />
                ) : (
                  <>
                    <Text style={styles.actionButtonText}>Pause Subscription</Text>
                    <Text style={styles.actionButtonSubtext}>
                      {retainer.pause_count}/2 pauses used this year
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {canResume && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonPrimary]}
                onPress={handleResume}
                disabled={actionLoading === 'resume'}
              >
                {actionLoading === 'resume' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                    Resume Subscription
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {canChangeTier && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/retainer/${id}/change-tier`)}
              >
                <Text style={styles.actionButtonText}>Change Plan</Text>
                <Text style={styles.actionButtonSubtext}>Switch to a different tier</Text>
              </TouchableOpacity>
            )}

            {canCancel && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonDanger]}
                onPress={() => router.push(`/retainer/${id}/cancel`)}
              >
                <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
                  Cancel Subscription
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  trialBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  trialBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  serviceName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  tierLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  infoValueWarning: {
    fontSize: 15,
    color: '#DC2626',
    fontWeight: '500',
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  professionalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  professionalLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4F46E5',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  chatButtonArrow: {
    fontSize: 18,
    color: '#fff',
  },
  billingEventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  billingEventType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  billingEventDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  billingEventAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  actionButton: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonPrimary: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  actionButtonDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  actionButtonTextPrimary: {
    color: '#fff',
  },
  actionButtonTextDanger: {
    color: '#DC2626',
  },
  actionButtonSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
});
