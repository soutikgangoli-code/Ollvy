// U19 Cancel Retainer Screen
// Spec:
// - If trial active: immediate cancellation
// - Else: cancellation effective at end of billing cycle
// - Show what user will lose
// - Confirm button

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase, getEdgeFunctionUrl } from '../../../lib/supabase';
import { useAuthStore } from '../../../store/auth';

interface RetainerInfo {
  id: string;
  status: string;
  is_trial_active: boolean;
  next_billing_date: string | null;
  service_packages: {
    name: string;
    tier_label: string | null;
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function CancelRetainerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuthStore();

  const [retainer, setRetainer] = useState<RetainerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchRetainer();
  }, [id]);

  const fetchRetainer = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('retainer_subscriptions')
        .select(`
          id,
          status,
          is_trial_active,
          next_billing_date,
          service_packages!inner (name, tier_label)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      // Transform Supabase array data to single objects
      const transformed: RetainerInfo = {
        ...data,
        service_packages: Array.isArray(data.service_packages) ? data.service_packages[0] : data.service_packages,
      };
      setRetainer(transformed);
    } catch (err) {
      console.error('Error fetching retainer:', err);
      Alert.alert('Error', 'Failed to load subscription details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!retainer) return;

    const message = retainer.is_trial_active
      ? 'Your subscription will be cancelled immediately.'
      : `Your subscription will remain active until ${retainer.next_billing_date ? formatDate(retainer.next_billing_date) : 'the end of your current billing cycle'}.`;

    Alert.alert(
      'Confirm Cancellation',
      `Are you sure you want to cancel your ${retainer.service_packages.name} subscription?\n\n${message}`,
      [
        { text: 'Go Back', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              const response = await fetch(getEdgeFunctionUrl('cancel-retainer'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                  retainer_subscription_id: id,
                  immediate: retainer.is_trial_active,
                }),
              });

              const data = await response.json();

              if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Failed to cancel subscription');
              }

              Alert.alert(
                'Subscription Cancelled',
                retainer.is_trial_active
                  ? 'Your subscription has been cancelled.'
                  : `Your subscription will end on ${data.effective_date ? formatDate(data.effective_date) : 'your next billing date'}. You can continue using the service until then.`,
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace(`/retainer/${id}`),
                  },
                ]
              );
            } catch (err: any) {
              Alert.alert('Error', err.message);
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Cancel Subscription', headerBackTitle: 'Back' }} />
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Cancel Subscription',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Cancel {retainer.service_packages.name}?</Text>
          {retainer.service_packages.tier_label && (
            <Text style={styles.tierLabel}>{retainer.service_packages.tier_label} Plan</Text>
          )}
        </View>

        {/* What happens section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What happens when you cancel</Text>

          {retainer.is_trial_active ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Immediate Cancellation</Text>
              <Text style={styles.infoCardText}>
                Since you're on a free trial, your subscription will be cancelled immediately with no charges.
              </Text>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>End of Cycle Cancellation</Text>
              <Text style={styles.infoCardText}>
                Your subscription will remain active until{' '}
                {retainer.next_billing_date
                  ? formatDate(retainer.next_billing_date)
                  : 'your current billing cycle ends'}
                . You won't be charged again.
              </Text>
            </View>
          )}
        </View>

        {/* What you'll lose section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you'll lose</Text>

          <View style={styles.loseItem}>
            <Text style={styles.loseIcon}>-</Text>
            <Text style={styles.loseText}>Dedicated compliance expert</Text>
          </View>

          <View style={styles.loseItem}>
            <Text style={styles.loseIcon}>-</Text>
            <Text style={styles.loseText}>Proactive compliance reminders</Text>
          </View>

          <View style={styles.loseItem}>
            <Text style={styles.loseIcon}>-</Text>
            <Text style={styles.loseText}>Priority support via chat</Text>
          </View>

          <View style={styles.loseItem}>
            <Text style={styles.loseIcon}>-</Text>
            <Text style={styles.loseText}>Monthly compliance tasks coverage</Text>
          </View>
        </View>

        {/* Alternative suggestion */}
        <View style={styles.section}>
          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionTitle}>Need a break instead?</Text>
            <Text style={styles.suggestionText}>
              You can pause your subscription for up to 1 month without cancelling. You have 2 pauses available per year.
            </Text>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={() => router.replace(`/retainer/${id}`)}
            >
              <Text style={styles.pauseButtonText}>Pause Instead</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.keepButton}
          onPress={() => router.back()}
        >
          <Text style={styles.keepButtonText}>Keep Subscription</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, cancelling && styles.cancelButtonDisabled]}
          onPress={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          )}
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  tierLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 4,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  loseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  loseIcon: {
    fontSize: 16,
    color: '#DC2626',
    marginRight: 12,
    fontWeight: '600',
  },
  loseText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  suggestionCard: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3730A3',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#4338CA',
    lineHeight: 20,
    marginBottom: 12,
  },
  pauseButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  pauseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  keepButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  keepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});
