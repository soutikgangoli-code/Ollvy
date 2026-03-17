// U20 Change Retainer Tier Screen
// Spec:
// - Show available tiers in the same tier group
// - Price comparison
// - Effective immediately
// - Cancel old subscription, create new

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
import { formatPaisa } from '@ollvy/shared';

interface RetainerInfo {
  id: string;
  service_package_id: string;
  monthly_price_paisa: number;
  service_packages: {
    name: string;
    tier_label: string | null;
    tier_group_id: string | null;
  };
}

interface TierOption {
  id: string;
  name: string;
  tier_label: string;
  price_base_paisa: number;
  price_gst_rate: number;
  short_description: string;
}

function formatPrice(paisa: number): string {
  return formatPaisa(paisa);
}

export default function ChangeTierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuthStore();

  const [retainer, setRetainer] = useState<RetainerInfo | null>(null);
  const [tiers, setTiers] = useState<TierOption[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    fetchRetainerAndTiers();
  }, [id]);

  const fetchRetainerAndTiers = async () => {
    if (!id) return;

    try {
      // Fetch retainer details
      const { data: retainerData, error: retainerError } = await supabase
        .from('retainer_subscriptions')
        .select(`
          id,
          service_package_id,
          monthly_price_paisa,
          service_packages!inner (name, tier_label, tier_group_id)
        `)
        .eq('id', id)
        .single();

      if (retainerError) throw retainerError;
      // Transform Supabase array data to single objects
      const transformedRetainer: RetainerInfo = {
        ...retainerData,
        service_packages: Array.isArray(retainerData.service_packages) ? retainerData.service_packages[0] : retainerData.service_packages,
      };
      setRetainer(transformedRetainer);

      if (!transformedRetainer.service_packages?.tier_group_id) {
        Alert.alert('Error', 'This subscription does not support tier changes');
        router.back();
        return;
      }

      // Fetch available tiers in the same tier group
      const { data: tiersData, error: tiersError } = await supabase
        .from('service_packages')
        .select('id, name, tier_label, price_base_paisa, price_gst_rate, short_description')
        .eq('tier_group_id', transformedRetainer.service_packages.tier_group_id)
        .eq('is_active', true)
        .order('price_base_paisa', { ascending: true });

      if (tiersError) throw tiersError;

      // Filter out current tier
      const otherTiers = tiersData?.filter((t) => t.id !== retainerData.service_package_id) || [];
      setTiers(otherTiers);

      if (otherTiers.length === 0) {
        Alert.alert('No Other Tiers', 'There are no other tiers available for this service');
        router.back();
      }
    } catch (err) {
      console.error('Error fetching tiers:', err);
      Alert.alert('Error', 'Failed to load tier options');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTier = async () => {
    if (!retainer || !selectedTierId) return;

    const selectedTier = tiers.find((t) => t.id === selectedTierId);
    if (!selectedTier) return;

    const newPrice = selectedTier.price_base_paisa + Math.round(selectedTier.price_base_paisa * (selectedTier.price_gst_rate / 100));

    Alert.alert(
      'Confirm Plan Change',
      `Switch to ${selectedTier.tier_label || selectedTier.name} at ${formatPrice(newPrice)}/month?\n\nThis change will take effect immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change Plan',
          onPress: async () => {
            setChanging(true);
            try {
              const response = await fetch(getEdgeFunctionUrl('change-retainer-tier'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                  retainer_subscription_id: id,
                  new_service_package_id: selectedTierId,
                }),
              });

              const data = await response.json();

              if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Failed to change tier');
              }

              Alert.alert(
                'Plan Changed',
                `You've been switched to the ${selectedTier.tier_label || selectedTier.name} plan.`,
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace(`/retainer/${data.new_retainer_subscription_id || id}`),
                  },
                ]
              );
            } catch (err: any) {
              Alert.alert('Error', err.message);
              setChanging(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Change Plan', headerBackTitle: 'Back' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!retainer || tiers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Error', headerBackTitle: 'Back' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No tier options available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Change Plan',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView style={styles.content}>
        {/* Current Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Plan</Text>
          <View style={styles.currentPlan}>
            <Text style={styles.currentPlanName}>
              {retainer.service_packages.tier_label || retainer.service_packages.name}
            </Text>
            <Text style={styles.currentPlanPrice}>
              {formatPrice(retainer.monthly_price_paisa)}/month
            </Text>
          </View>
        </View>

        {/* Available Tiers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Switch To</Text>

          {tiers.map((tier) => {
            const tierTotal = tier.price_base_paisa + Math.round(tier.price_base_paisa * (tier.price_gst_rate / 100));
            const isSelected = selectedTierId === tier.id;
            const priceDiff = tierTotal - retainer.monthly_price_paisa;
            const isUpgrade = priceDiff > 0;

            return (
              <TouchableOpacity
                key={tier.id}
                style={[styles.tierOption, isSelected && styles.tierOptionSelected]}
                onPress={() => setSelectedTierId(tier.id)}
              >
                <View style={[styles.tierRadio, isSelected && styles.tierRadioSelected]}>
                  {isSelected && <View style={styles.tierRadioInner} />}
                </View>

                <View style={styles.tierInfo}>
                  <View style={styles.tierHeader}>
                    <Text style={[styles.tierLabel, isSelected && styles.tierLabelSelected]}>
                      {tier.tier_label || tier.name}
                    </Text>
                    {priceDiff !== 0 && (
                      <View style={[styles.diffBadge, isUpgrade ? styles.upgradeBadge : styles.downgradeBadge]}>
                        <Text style={[styles.diffBadgeText, isUpgrade ? styles.upgradeText : styles.downgradeText]}>
                          {isUpgrade ? '+' : ''}{formatPrice(priceDiff)}/mo
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.tierPrice}>
                    {formatPrice(tierTotal)}/month
                  </Text>

                  {tier.short_description && (
                    <Text style={styles.tierDescription} numberOfLines={2}>
                      {tier.short_description}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How plan changes work</Text>
            <Text style={styles.infoText}>
              Your plan will be updated immediately. The new price will apply to your next billing cycle on the 25th.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.ctaButton, (!selectedTierId || changing) && styles.ctaButtonDisabled]}
          onPress={handleChangeTier}
          disabled={!selectedTierId || changing}
        >
          {changing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.ctaButtonText}>
              {selectedTierId
                ? `Switch to ${tiers.find((t) => t.id === selectedTierId)?.tier_label || 'New Plan'}`
                : 'Select a Plan'}
            </Text>
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
  currentPlan: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
  },
  currentPlanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  currentPlanPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  tierOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  tierOptionSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#F5F3FF',
  },
  tierRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tierRadioSelected: {
    borderColor: '#4F46E5',
  },
  tierRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4F46E5',
  },
  tierInfo: {
    flex: 1,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tierLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  tierLabelSelected: {
    color: '#4F46E5',
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  upgradeBadge: {
    backgroundColor: '#D1FAE5',
  },
  downgradeBadge: {
    backgroundColor: '#FEE2E2',
  },
  diffBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  upgradeText: {
    color: '#065F46',
  },
  downgradeText: {
    color: '#DC2626',
  },
  tierPrice: {
    fontSize: 14,
    color: '#6B7280',
  },
  tierDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3730A3',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4338CA',
    lineHeight: 20,
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
  },
  ctaButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
