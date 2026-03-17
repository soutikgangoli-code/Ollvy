// U09 Service Detail Screen
// Spec:
// - Fetch service_package by id from Supabase
// - Show: name, full description, price breakdown (base + govt fees + GST), SLA in working days
// - Deliverables list, required documents list (from workflow_stages)
// - CTA: 'Get Started' — if price_varies_by_state=true navigate to /quote/request/[id], else navigate to /checkout/[id]
// - If tier_group_id set, show tier picker (radio)

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface WorkflowStage {
  stage_key: string;
  stage_name: string;
  sla_working_days: number;
  wait_for_govt: boolean;
}

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
  workflow_stages: WorkflowStage[] | null;
}

interface TierService {
  id: string;
  name: string;
  tier_label: string;
  price_base_paisa: number;
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

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [service, setService] = useState<ServicePackage | null>(null);
  const [tierServices, setTierServices] = useState<TierService[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch the service
      const { data: serviceData, error: serviceError } = await supabase
        .from('service_packages')
        .select('*')
        .eq('id', id)
        .single();

      if (serviceError) throw serviceError;

      setService(serviceData);
      setSelectedTierId(serviceData.id);

      // If has tier_group_id, fetch all tiers
      if (serviceData.tier_group_id) {
        const { data: tiersData, error: tiersError } = await supabase
          .from('service_packages')
          .select('id, name, tier_label, price_base_paisa')
          .eq('tier_group_id', serviceData.tier_group_id)
          .eq('is_active', true)
          .order('price_base_paisa', { ascending: true });

        if (!tiersError && tiersData) {
          setTierServices(tiersData);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch service:', err);
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    const targetId = selectedTierId || id;

    if (service?.price_varies_by_state) {
      // Quote flow for variable-price services
      router.push(`/quote/request/${targetId}`);
    } else {
      // Direct checkout
      router.push(`/checkout/${targetId}`);
    }
  };

  const handleTierSelect = (tierId: string) => {
    setSelectedTierId(tierId);
    // Update service details for selected tier
    const selectedTier = tierServices.find(t => t.id === tierId);
    if (selectedTier && service) {
      setService({
        ...service,
        id: selectedTier.id,
        name: selectedTier.name,
        tier_label: selectedTier.tier_label,
        price_base_paisa: selectedTier.price_base_paisa,
      });
    }
  };

  // Calculate price breakdown
  const calculatePriceBreakdown = () => {
    if (!service) return null;

    const basePaisa = service.price_base_paisa;
    const govtFeesPaisa = service.price_govt_fees_paisa;
    const gstPaisa = Math.round(basePaisa * (service.price_gst_rate / 100));
    const totalPaisa = basePaisa + govtFeesPaisa + gstPaisa;

    return {
      base: basePaisa,
      govtFees: govtFeesPaisa,
      gst: gstPaisa,
      gstRate: service.price_gst_rate,
      total: totalPaisa,
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Loading...', headerBackTitle: 'Back' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !service) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Error', headerBackTitle: 'Back' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Service not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchService}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const priceBreakdown = calculatePriceBreakdown();
  const workflowStages = service.workflow_stages || [];
  const billingLabel = service.billing_cycle === 'monthly' ? '/month' : '';
  const ctaLabel = service.price_varies_by_state ? 'Get Exact Quote' : 'Get Started';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: service.name,
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Header */}
        <View style={styles.header}>
          <Text style={styles.serviceName}>{service.name}</Text>
          {service.tier_label && (
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>{service.tier_label}</Text>
            </View>
          )}
          <Text style={styles.serviceDescription}>{service.short_description}</Text>
        </View>

        {/* Tier Picker (if applicable) */}
        {tierServices.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Your Plan</Text>
            {tierServices.map((tier) => (
              <TouchableOpacity
                key={tier.id}
                style={[
                  styles.tierOption,
                  selectedTierId === tier.id && styles.tierOptionSelected
                ]}
                onPress={() => handleTierSelect(tier.id)}
              >
                <View style={styles.tierRadio}>
                  <View style={[
                    styles.tierRadioInner,
                    selectedTierId === tier.id && styles.tierRadioInnerSelected
                  ]} />
                </View>
                <View style={styles.tierInfo}>
                  <Text style={styles.tierLabel}>{tier.tier_label}</Text>
                  <Text style={styles.tierPrice}>{formatPaisa(tier.price_base_paisa)}/mo</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Price Breakdown */}
        {priceBreakdown && !service.price_varies_by_state && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Professional Fee</Text>
              <Text style={styles.priceValue}>{formatPaisa(priceBreakdown.base)}{billingLabel}</Text>
            </View>
            {priceBreakdown.govtFees > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Government Fees</Text>
                <Text style={styles.priceValue}>{formatPaisa(priceBreakdown.govtFees)}</Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>GST ({priceBreakdown.gstRate}%)</Text>
              <Text style={styles.priceValue}>{formatPaisa(priceBreakdown.gst)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPaisa(priceBreakdown.total)}{billingLabel}</Text>
            </View>
          </View>
        )}

        {/* Variable Price Note */}
        {service.price_varies_by_state && (
          <View style={styles.section}>
            <View style={styles.quoteNote}>
              <Text style={styles.quoteNoteText}>
                Government fees vary by state. Request a quote to get exact pricing for your location.
              </Text>
            </View>
          </View>
        )}

        {/* SLA & Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.slaCard}>
            <Text style={styles.slaNumber}>{service.sla_working_days}</Text>
            <Text style={styles.slaUnit}>working days</Text>
          </View>
        </View>

        {/* Workflow Stages */}
        {workflowStages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What We'll Do</Text>
            {workflowStages.map((stage, index) => (
              <View key={stage.stage_key} style={styles.stageItem}>
                <View style={styles.stageNumber}>
                  <Text style={styles.stageNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stageContent}>
                  <Text style={styles.stageName}>{stage.stage_name}</Text>
                  <Text style={styles.stageSla}>{stage.sla_working_days} working days</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bottom spacing for CTA */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
          <Text style={styles.ctaButtonText}>{ctaLabel}</Text>
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
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  serviceName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  serviceDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  tierOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  tierOptionSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  tierRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tierRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  tierRadioInnerSelected: {
    backgroundColor: '#4F46E5',
  },
  tierInfo: {
    flex: 1,
  },
  tierLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  tierPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
  quoteNote: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
  },
  quoteNoteText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  slaCard: {
    backgroundColor: '#EEF2FF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  slaNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4F46E5',
  },
  slaUnit: {
    fontSize: 14,
    color: '#6366F1',
    marginTop: 4,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stageNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stageNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  stageContent: {
    flex: 1,
  },
  stageName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  stageSla: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
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
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});
