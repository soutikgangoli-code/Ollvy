// U08 Home Screen — Service Catalogue
// Spec from §22:
// - Service grid fetched from search-services
// - Filter chips for situation tags at top
// - Search bar (300ms debounce before calling search-services)
// - Each service card: name, short_description, price from Rs X, urgency badge if urgency_score >= 8
// - Tap navigates to /service/[id]

import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/auth';
import { getEdgeFunctionUrl } from '../../lib/supabase';

// Situation tags for filter chips
const SITUATION_TAGS = [
  { key: 'all', label: 'All Services' },
  { key: 'just_starting_out', label: 'Starting Out' },
  { key: 'taking_payments', label: 'Taking Payments' },
  { key: 'filing_taxes', label: 'Filing Taxes' },
  { key: 'have_investors', label: 'Have Investors' },
  { key: 'importing_exporting', label: 'Import/Export' },
];

interface ServicePackage {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  price_base_paisa: number;
  price_govt_fees_paisa: number;
  price_gst_rate: number;
  price_varies_by_state: boolean;
  sla_working_days: number;
  situation_tags: string[];
  urgency_score: number;
  order_type: string;
  billing_cycle: string;
  tier_group_id: string | null;
  tier_label: string | null;
}

// Format paisa to rupees
function formatPaisa(paisa: number): string {
  const rupees = paisa / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

export default function HomeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch services from search-services edge function
  const fetchServices = useCallback(async (query?: string, tags?: string[]) => {
    setLoading(true);
    try {
      let url = getEdgeFunctionUrl('search-services');
      const params = new URLSearchParams();

      if (query && query.length >= 2) {
        params.append('query', query);
      }
      if (tags && tags.length > 0) {
        params.append('situation_tags', tags.join(','));
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.ok && data.services) {
        setServices(data.services);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle search with 300ms debounce
  const handleSearch = (text: string) => {
    setSearchQuery(text);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounce
    const timeout = setTimeout(() => {
      const tags = selectedTag !== 'all' ? [selectedTag] : undefined;
      fetchServices(text, tags);
    }, 300);

    setSearchTimeout(timeout);
  };

  // Handle tag selection
  const handleTagSelect = (tagKey: string) => {
    setSelectedTag(tagKey);
    const tags = tagKey !== 'all' ? [tagKey] : undefined;
    fetchServices(searchQuery, tags);
  };

  // Navigate to service detail
  const handleServicePress = (service: ServicePackage) => {
    router.push(`/service/${service.id}`);
  };

  // Render service card
  const renderServiceCard = ({ item }: { item: ServicePackage }) => {
    const showUrgencyBadge = item.urgency_score >= 80; // High urgency (scaled to 100)
    const priceLabel = item.billing_cycle === 'monthly'
      ? `${formatPaisa(item.price_base_paisa)}/mo`
      : `From ${formatPaisa(item.price_base_paisa)}`;

    return (
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => handleServicePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.serviceCardHeader}>
          <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
          {showUrgencyBadge && (
            <View style={styles.urgencyBadge}>
              <Text style={styles.urgencyBadgeText}>Urgent</Text>
            </View>
          )}
        </View>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.short_description}
        </Text>
        <View style={styles.serviceCardFooter}>
          <Text style={styles.servicePrice}>{priceLabel}</Text>
          <Text style={styles.serviceSla}>{item.sla_working_days} working days</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {user?.business_name ? `Hi, ${user.business_name}` : 'Welcome to Ollvy'}
        </Text>
        <Text style={styles.subtitle}>What compliance task can we help with?</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {SITUATION_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag.key}
            style={[
              styles.filterChip,
              selectedTag === tag.key && styles.filterChipActive
            ]}
            onPress={() => handleTagSelect(tag.key)}
          >
            <Text style={[
              styles.filterChipText,
              selectedTag === tag.key && styles.filterChipTextActive
            ]}>
              {tag.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Service Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={services}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.serviceList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No services found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterContainer: {
    maxHeight: 44,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceList: {
    padding: 20,
    paddingTop: 16,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  urgencyBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgencyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
    textTransform: 'uppercase',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },
  serviceSla: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
