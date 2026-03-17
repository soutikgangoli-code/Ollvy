import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore, SITUATIONS } from '../../store/onboarding';
import { useAuthStore } from '../../store/auth';
import { supabase, getEdgeFunctionUrl } from '../../lib/supabase';

interface ServiceRecommendation {
  id: string;
  name: string;
  short_description: string;
  base_price_paisa: number;
  urgency_score: number;
  reason?: string;
}

export default function RecommendationsScreen() {
  const router = useRouter();
  const { situations, state, getDbBusinessType } = useOnboardingStore();
  const { session, user, setUser, setIsNewUser } = useAuthStore();

  const [recommendations, setRecommendations] = useState<ServiceRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Map situation IDs to their labels for matching with situation_tags
      const situationLabels = situations.map(
        (id) => SITUATIONS.find((s) => s.id === id)?.label || id
      );

      const response = await fetch(getEdgeFunctionUrl('get-recommendations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          situations: situationLabels,
          business_type: getDbBusinessType(),
          state: state,
        }),
      });

      const data = await response.json();

      if (data.recommendations) {
        setRecommendations(data.recommendations);
      } else if (data.stub) {
        // Stub response - show empty state
        setRecommendations([]);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Recommendations error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServicePress = (serviceId: string) => {
    // Navigate to service detail (placeholder for now)
    router.push({
      pathname: '/(tabs)',
      params: { serviceId },
    });
  };

  const handleComplete = async () => {
    // Update user with business_type and state
    if (user?.id) {
      const businessType = getDbBusinessType();

      const { error: updateError } = await supabase
        .from('users')
        .update({
          business_type: businessType,
          state: state,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Failed to update user:', updateError);
      } else {
        // Update local user state
        setUser({
          ...user,
          business_type: businessType || undefined,
          state: state || undefined,
        });
      }
    }

    setIsNewUser(false);
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    setIsNewUser(false);
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    router.back();
  };

  const formatPrice = (paisa: number): string => {
    const rupees = paisa / 100;
    return `Rs ${rupees.toLocaleString('en-IN')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.step}>Step 4 of 4</Text>
          <Text style={styles.title}>Recommended for you</Text>
          <Text style={styles.subtitle}>
            Based on your situation, here are the services you might need.
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Finding the best services for you...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRecommendations}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : recommendations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No specific recommendations</Text>
          <Text style={styles.emptyText}>
            You can explore all our services from the home screen.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.cardsContainer}>
            {recommendations.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServicePress(service.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  {service.urgency_score >= 8 && (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentBadgeText}>Urgent</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {service.short_description}
                </Text>

                {service.reason && (
                  <Text style={styles.serviceReason}>{service.reason}</Text>
                )}

                <View style={styles.cardFooter}>
                  <Text style={styles.servicePrice}>
                    From {formatPrice(service.base_price_paisa)}
                  </Text>
                  <Text style={styles.viewDetails}>View details</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>
            {recommendations.length > 0 ? 'Continue to Home' : 'Get Started'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedHeader: {
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 16,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  header: {
    marginTop: 16,
  },
  step: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  cardsContainer: {
    gap: 16,
  },
  serviceCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  urgentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
  },
  urgentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  serviceReason: {
    fontSize: 13,
    color: '#6366F1',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  viewDetails: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  completeButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },
});
