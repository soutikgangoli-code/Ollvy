// U12/U13 Checkout Screen — One-Time Orders & Retainer Subscriptions
// Spec:
// - For one-time: Price breakdown showing base, govt fees, GST as separate lines
// - For retainer: Monthly price, tier selection if applicable, billing anchor info
// - Promo code section (one-time only, collapsible)
// - Referral credit section if user has referral_credit_balance_paisa > 0
// - Razorpay SDK integration — opens payment sheet on tap
// - On payment success: navigate to /order/[id] or /retainer/[id]

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase, getEdgeFunctionUrl } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

interface ServicePackage {
  id: string;
  name: string;
  short_description: string;
  price_base_paisa: number;
  price_govt_fees_paisa: number;
  price_gst_rate: number;
  sla_working_days: number;
  billing_cycle?: string;
  order_type?: string;
  tier_group_id?: string;
  tier_label?: string;
}

interface TierOption {
  id: string;
  name: string;
  tier_label: string;
  price_base_paisa: number;
  price_gst_rate: number;
}

interface PriceBreakdown {
  base: number;
  pro_discount: number;
  promo_discount: number;
  referral_credit: number;
  govt_fees: number;
  gst: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
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

export default function CheckoutScreen() {
  const { serviceId, quoteId } = useLocalSearchParams<{ serviceId: string; quoteId?: string }>();
  const router = useRouter();
  const { session, user } = useAuthStore();

  const [service, setService] = useState<ServicePackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Retainer-specific state
  const [isRetainer, setIsRetainer] = useState(false);
  const [tierOptions, setTierOptions] = useState<TierOption[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [isProTrial, setIsProTrial] = useState(false);

  // Promo code state (one-time only)
  const [promoCode, setPromoCode] = useState('');
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [promoValidating, setPromoValidating] = useState(false);
  const [promoValid, setPromoValid] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Referral credit
  const [useReferralCredit, setUseReferralCredit] = useState(false);
  const referralBalance = user?.referral_credit_balance_paisa || 0;

  // Price calculation
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  // Check Pro trial eligibility
  useEffect(() => {
    if (isRetainer && user?.subscription_tier === 'pro') {
      checkProTrialEligibility();
    }
  }, [isRetainer, user]);

  const checkProTrialEligibility = async () => {
    try {
      const { data, error } = await supabase
        .from('retainer_subscriptions')
        .select('id')
        .eq('user_id', user?.id)
        .limit(1);

      setIsProTrial(!data || data.length === 0);
    } catch (err) {
      setIsProTrial(false);
    }
  };

  useEffect(() => {
    if (service) {
      calculatePrice();
    }
  }, [service, promoDiscount, useReferralCredit]);

  const fetchService = async () => {
    if (!serviceId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_packages')
        .select('id, name, short_description, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, billing_cycle, order_type, tier_group_id, tier_label')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data);

      // Check if this is a retainer service
      const isRetainerService = data.billing_cycle === 'monthly' || data.billing_cycle === 'quarterly' || data.order_type === 'recurring';
      setIsRetainer(isRetainerService);

      // Fetch tier options if service has tier_group_id
      if (data.tier_group_id) {
        const { data: tiers } = await supabase
          .from('service_packages')
          .select('id, name, tier_label, price_base_paisa, price_gst_rate')
          .eq('tier_group_id', data.tier_group_id)
          .eq('is_active', true)
          .order('price_base_paisa', { ascending: true });

        if (tiers && tiers.length > 0) {
          setTierOptions(tiers);
          setSelectedTierId(serviceId); // Default to current tier
        }
      }
    } catch (err) {
      console.error('Failed to fetch service:', err);
      Alert.alert('Error', 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!service) return;

    const basePaisa = service.price_base_paisa;
    const govtFeesPaisa = service.price_govt_fees_paisa || 0;

    // Pro discount (5% for pro users)
    const proDiscountPaisa = user?.subscription_tier === 'pro'
      ? Math.round(basePaisa * 0.05)
      : 0;

    const adjustedBase = basePaisa - proDiscountPaisa - promoDiscount;
    const gstPaisa = Math.round(adjustedBase * (service.price_gst_rate / 100));

    // Referral credit (max = adjusted base)
    const referralUsed = useReferralCredit
      ? Math.min(referralBalance, adjustedBase)
      : 0;

    const totalPaisa = adjustedBase - referralUsed + govtFeesPaisa + gstPaisa;

    setPriceBreakdown({
      base: basePaisa,
      pro_discount: proDiscountPaisa,
      promo_discount: promoDiscount,
      referral_credit: referralUsed,
      govt_fees: govtFeesPaisa,
      gst: gstPaisa,
      cgst: 0, // Will be calculated server-side
      sgst: 0,
      igst: gstPaisa,
      total: Math.max(totalPaisa, govtFeesPaisa + gstPaisa), // Floor
    });
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setPromoValidating(true);
    setPromoError(null);

    try {
      // Call resolve-promo (simplified - in production this would be a full API call)
      const response = await fetch(getEdgeFunctionUrl('resolve-promo'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          code: promoCode.toUpperCase(),
          service_package_id: serviceId,
          base_price_paisa: service?.price_base_paisa || 0,
        }),
      });

      const data = await response.json();

      if (data.ok && data.valid) {
        setPromoValid(true);
        setPromoDiscount(data.discount_paisa);
      } else {
        setPromoError(data.message || 'Invalid promo code');
        setPromoValid(false);
        setPromoDiscount(0);
      }
    } catch (err) {
      setPromoError('Failed to validate promo code');
      setPromoValid(false);
    } finally {
      setPromoValidating(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoValid(false);
    setPromoDiscount(0);
    setPromoError(null);
  };

  const handlePayment = async () => {
    if (!service || !priceBreakdown) return;

    setProcessing(true);

    try {
      if (isRetainer) {
        // Create Razorpay subscription for retainer
        const response = await fetch(getEdgeFunctionUrl('create-razorpay-subscription'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            service_package_id: selectedTierId || serviceId,
            billing_cycle: service.billing_cycle || 'monthly',
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.error || 'Failed to create subscription');
        }

        // In production, this would redirect to Razorpay subscription checkout
        Alert.alert(
          'Subscription Created',
          isProTrial
            ? `Your ${service.name} subscription is active!\n\nEnjoy your 30-day free trial. Billing starts after the trial period.`
            : `Your ${service.name} subscription is active!\n\nYour first billing date will be the 25th of ${new Date().getDate() <= 24 ? 'this' : 'next'} month.`,
          [
            {
              text: 'View Retainer',
              onPress: () => {
                router.replace(`/retainer/${data.retainer_subscription_id}`);
              },
            },
          ]
        );
      } else {
        // Create Razorpay order for one-time payment
        const response = await fetch(getEdgeFunctionUrl('create-razorpay-order'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            service_package_id: quoteId ? undefined : serviceId,
            quote_request_id: quoteId || undefined,
            promo_code: promoValid ? promoCode.toUpperCase() : undefined,
            use_referral_credit: useReferralCredit,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.error || 'Failed to create order');
        }

        // In a real app, we would open Razorpay SDK here
        Alert.alert(
          'Payment',
          `Razorpay order created!\n\nOrder ID: ${data.razorpay_order_id}\nAmount: ${formatPaisa(data.amount)}\n\nIn production, this would open the Razorpay payment sheet.`,
          [
            {
              text: 'Simulate Success',
              onPress: () => {
                router.replace(`/order/${data.order_id}`);
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      Alert.alert('Error', err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Checkout', headerBackTitle: 'Back' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Error', headerBackTitle: 'Back' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Service not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Checkout',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Summary */}
        <View style={styles.section}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{service.name}</Text>
            {isRetainer && (
              <View style={styles.subscriptionBadge}>
                <Text style={styles.subscriptionBadgeText}>Subscription</Text>
              </View>
            )}
          </View>
          <Text style={styles.serviceDescription}>{service.short_description}</Text>

          {isRetainer ? (
            <View style={styles.retainerInfoRow}>
              <Text style={styles.retainerInfoText}>
                Billed {service.billing_cycle === 'quarterly' ? 'quarterly' : 'monthly'} on the 25th
              </Text>
            </View>
          ) : (
            <View style={styles.slaRow}>
              <Text style={styles.slaText}>Delivery: {service.sla_working_days} working days</Text>
            </View>
          )}

          {/* Pro Trial Badge */}
          {isRetainer && isProTrial && (
            <View style={styles.trialBadge}>
              <Text style={styles.trialBadgeText}>30-Day Free Trial</Text>
              <Text style={styles.trialBadgeSubtext}>Pro member benefit - first retainer free for 30 days</Text>
            </View>
          )}
        </View>

        {/* Tier Selection (for retainers with tier groups) */}
        {isRetainer && tierOptions.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Plan</Text>
            {tierOptions.map((tier) => {
              const tierTotal = tier.price_base_paisa + Math.round(tier.price_base_paisa * (tier.price_gst_rate / 100));
              const isSelected = selectedTierId === tier.id;

              return (
                <TouchableOpacity
                  key={tier.id}
                  style={[styles.tierOption, isSelected && styles.tierOptionSelected]}
                  onPress={() => {
                    setSelectedTierId(tier.id);
                    // Update service with selected tier
                    setService({
                      ...service,
                      id: tier.id,
                      name: tier.name,
                      tier_label: tier.tier_label,
                      price_base_paisa: tier.price_base_paisa,
                      price_gst_rate: tier.price_gst_rate,
                    });
                  }}
                >
                  <View style={[styles.tierRadio, isSelected && styles.tierRadioSelected]}>
                    {isSelected && <View style={styles.tierRadioInner} />}
                  </View>
                  <View style={styles.tierInfo}>
                    <Text style={[styles.tierLabel, isSelected && styles.tierLabelSelected]}>
                      {tier.tier_label || tier.name}
                    </Text>
                    <Text style={styles.tierPrice}>
                      {formatPaisa(tierTotal)}/month
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Price Breakdown */}
        {priceBreakdown && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fee</Text>
              <Text style={styles.priceValue}>{formatPaisa(priceBreakdown.base)}</Text>
            </View>

            {priceBreakdown.pro_discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.discountLabel}>Pro Discount (5%)</Text>
                <Text style={styles.discountValue}>-{formatPaisa(priceBreakdown.pro_discount)}</Text>
              </View>
            )}

            {priceBreakdown.promo_discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.discountLabel}>Promo Discount</Text>
                <Text style={styles.discountValue}>-{formatPaisa(priceBreakdown.promo_discount)}</Text>
              </View>
            )}

            {priceBreakdown.referral_credit > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.discountLabel}>Referral Credit</Text>
                <Text style={styles.discountValue}>-{formatPaisa(priceBreakdown.referral_credit)}</Text>
              </View>
            )}

            {priceBreakdown.govt_fees > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Government Fees</Text>
                <Text style={styles.priceValue}>{formatPaisa(priceBreakdown.govt_fees)}</Text>
              </View>
            )}

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>GST ({service.price_gst_rate}%)</Text>
              <Text style={styles.priceValue}>{formatPaisa(priceBreakdown.gst)}</Text>
            </View>

            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPaisa(priceBreakdown.total)}</Text>
            </View>
          </View>
        )}

        {/* Promo Code Section (one-time orders only) */}
        {!isRetainer && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.promoHeader}
              onPress={() => setPromoExpanded(!promoExpanded)}
            >
              <Text style={styles.promoHeaderText}>Have a promo code?</Text>
              <Text style={styles.promoHeaderIcon}>{promoExpanded ? '−' : '+'}</Text>
            </TouchableOpacity>

            {promoExpanded && (
              <View style={styles.promoContent}>
                {promoValid ? (
                  <View style={styles.promoApplied}>
                    <Text style={styles.promoAppliedText}>
                      {promoCode.toUpperCase()} applied - {formatPaisa(promoDiscount)} off
                    </Text>
                    <TouchableOpacity onPress={handleRemovePromo}>
                      <Text style={styles.promoRemove}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.promoInputRow}>
                    <TextInput
                      style={[styles.promoInput, promoError ? styles.promoInputError : undefined]}
                      value={promoCode}
                      onChangeText={(text) => {
                        setPromoCode(text.toUpperCase());
                        setPromoError(null);
                      }}
                      placeholder="Enter promo code"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="characters"
                      maxLength={20}
                    />
                    <TouchableOpacity
                      style={styles.promoApplyButton}
                      onPress={handleApplyPromo}
                      disabled={promoValidating || !promoCode.trim()}
                    >
                      {promoValidating ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.promoApplyButtonText}>Apply</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
                {promoError && (
                  <Text style={styles.promoErrorText}>{promoError}</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Referral Credit Section */}
        {referralBalance > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.referralRow}
              onPress={() => setUseReferralCredit(!useReferralCredit)}
            >
              <View style={[styles.checkbox, useReferralCredit && styles.checkboxChecked]}>
                {useReferralCredit && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.referralInfo}>
                <Text style={styles.referralLabel}>Use Referral Credit</Text>
                <Text style={styles.referralBalance}>
                  Available: {formatPaisa(referralBalance)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Pay/Subscribe Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.ctaButton, processing && styles.ctaButtonDisabled]}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : isRetainer ? (
            <Text style={styles.ctaButtonText}>
              {isProTrial ? 'Start Free Trial' : `Subscribe ${priceBreakdown ? formatPaisa(priceBreakdown.total) + '/mo' : ''}`}
            </Text>
          ) : (
            <Text style={styles.ctaButtonText}>
              Pay {priceBreakdown ? formatPaisa(priceBreakdown.total) : ''}
            </Text>
          )}
        </TouchableOpacity>
        <Text style={styles.secureText}>
          {isRetainer
            ? isProTrial
              ? 'Cancel anytime during trial'
              : 'Cancel or pause anytime'
            : 'Secured by Razorpay'}
        </Text>
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
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  subscriptionBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subscriptionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  slaRow: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  slaText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  retainerInfoRow: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retainerInfoText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '500',
  },
  trialBadge: {
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  trialBadgeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#065F46',
  },
  trialBadgeSubtext: {
    fontSize: 13,
    color: '#047857',
    marginTop: 2,
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
  tierLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  tierLabelSelected: {
    color: '#4F46E5',
  },
  tierPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
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
  discountLabel: {
    fontSize: 15,
    color: '#059669',
  },
  discountValue: {
    fontSize: 15,
    color: '#059669',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#4F46E5',
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoHeaderText: {
    fontSize: 15,
    color: '#4F46E5',
    fontWeight: '500',
  },
  promoHeaderIcon: {
    fontSize: 20,
    color: '#4F46E5',
    fontWeight: '500',
  },
  promoContent: {
    marginTop: 16,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  promoInputError: {
    borderColor: '#DC2626',
  },
  promoApplyButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  promoApplyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  promoApplied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 10,
  },
  promoAppliedText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '500',
  },
  promoRemove: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
  promoErrorText: {
    fontSize: 13,
    color: '#DC2626',
    marginTop: 8,
  },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  referralInfo: {
    flex: 1,
  },
  referralLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  referralBalance: {
    fontSize: 13,
    color: '#6B7280',
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
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  secureText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});
