// U11 Quote Detail / Accept Screen
// Spec:
// - Shows confirmed_price_paisa + govt fees + GST
// - 48h expiry countdown
// - 'Accept and Book' CTA triggers Razorpay order at confirmed price
// - Expired state shows re-request CTA

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface QuoteRequest {
  id: string;
  user_id: string;
  service_package_id: string;
  status: 'pending' | 'quoted' | 'accepted' | 'expired';
  submitted_details: {
    state: string;
    city?: string;
    business_name?: string;
    requirements?: string;
  };
  confirmed_price_paisa: number | null;
  confirmed_govt_fees_paisa: number | null;
  quoted_at: string | null;
  expires_at: string | null;
  created_at: string;
  service_packages: {
    id: string;
    name: string;
    short_description: string;
    price_gst_rate: number;
  };
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

// Calculate time remaining
function getTimeRemaining(expiresAt: string): { hours: number; minutes: number; expired: boolean } {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, expired: false };
}

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; expired: boolean } | null>(null);

  useEffect(() => {
    fetchQuote();
  }, [id]);

  // Update countdown every minute
  useEffect(() => {
    if (!quote?.expires_at) return;

    const updateTimer = () => {
      setTimeRemaining(getTimeRemaining(quote.expires_at!));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [quote?.expires_at]);

  const fetchQuote = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select(`
          *,
          service_packages!inner (id, name, short_description, price_gst_rate)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setQuote(data);

      if (data.expires_at) {
        setTimeRemaining(getTimeRemaining(data.expires_at));
      }
    } catch (err) {
      console.error('Failed to fetch quote:', err);
      Alert.alert('Error', 'Failed to load quote details');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (!quote || !quote.confirmed_price_paisa) return;

    // Navigate to checkout with quote
    router.push(`/checkout/${quote.service_package_id}?quoteId=${quote.id}`);
  };

  const handleReRequest = () => {
    if (!quote) return;
    router.push(`/quote/request/${quote.service_package_id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Quote', headerBackTitle: 'Back' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!quote) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Error', headerBackTitle: 'Back' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Quote not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const service = quote.service_packages;
  const isQuoted = quote.status === 'quoted' && quote.confirmed_price_paisa;
  const isExpired = timeRemaining?.expired || quote.status === 'expired';
  const isPending = quote.status === 'pending';
  const isAccepted = quote.status === 'accepted';

  // Calculate price breakdown for quoted
  let priceBreakdown = null;
  if (isQuoted && quote.confirmed_price_paisa) {
    const basePaisa = quote.confirmed_price_paisa;
    const govtFeesPaisa = quote.confirmed_govt_fees_paisa || 0;
    const gstPaisa = Math.round(basePaisa * (service.price_gst_rate / 100));
    const totalPaisa = basePaisa + govtFeesPaisa + gstPaisa;

    priceBreakdown = {
      base: basePaisa,
      govtFees: govtFeesPaisa,
      gst: gstPaisa,
      gstRate: service.price_gst_rate,
      total: totalPaisa,
    };
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Quote Details',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Info */}
        <View style={styles.header}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.short_description}</Text>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          {isPending && (
            <View style={styles.statusBadgePending}>
              <Text style={styles.statusTextPending}>Pending Review</Text>
            </View>
          )}
          {isQuoted && !isExpired && (
            <View style={styles.statusBadgeQuoted}>
              <Text style={styles.statusTextQuoted}>Quote Ready</Text>
            </View>
          )}
          {isExpired && (
            <View style={styles.statusBadgeExpired}>
              <Text style={styles.statusTextExpired}>Quote Expired</Text>
            </View>
          )}
          {isAccepted && (
            <View style={styles.statusBadgeAccepted}>
              <Text style={styles.statusTextAccepted}>Accepted</Text>
            </View>
          )}
        </View>

        {/* Pending Message */}
        {isPending && (
          <View style={styles.section}>
            <View style={styles.pendingNote}>
              <Text style={styles.pendingNoteTitle}>We're reviewing your request</Text>
              <Text style={styles.pendingNoteText}>
                Our team will prepare a customized quote for you within 24 hours.
                We'll notify you as soon as it's ready.
              </Text>
            </View>
          </View>
        )}

        {/* Expiry Countdown */}
        {isQuoted && !isExpired && timeRemaining && (
          <View style={styles.section}>
            <View style={styles.expiryCard}>
              <Text style={styles.expiryLabel}>Quote expires in</Text>
              <Text style={styles.expiryTime}>
                {timeRemaining.hours}h {timeRemaining.minutes}m
              </Text>
            </View>
          </View>
        )}

        {/* Price Breakdown (when quoted) */}
        {priceBreakdown && !isExpired && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Quote</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Professional Fee</Text>
              <Text style={styles.priceValue}>{formatPaisa(priceBreakdown.base)}</Text>
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
              <Text style={styles.totalValue}>{formatPaisa(priceBreakdown.total)}</Text>
            </View>
          </View>
        )}

        {/* Submitted Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>State</Text>
            <Text style={styles.detailValue}>{quote.submitted_details.state}</Text>
          </View>
          {quote.submitted_details.city && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>City</Text>
              <Text style={styles.detailValue}>{quote.submitted_details.city}</Text>
            </View>
          )}
          {quote.submitted_details.business_name && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Business</Text>
              <Text style={styles.detailValue}>{quote.submitted_details.business_name}</Text>
            </View>
          )}
          {quote.submitted_details.requirements && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Requirements</Text>
              <Text style={styles.detailValue}>{quote.submitted_details.requirements}</Text>
            </View>
          )}
        </View>

        {/* Expired Message */}
        {isExpired && (
          <View style={styles.section}>
            <View style={styles.expiredNote}>
              <Text style={styles.expiredNoteText}>
                This quote has expired. Please request a new quote to get updated pricing.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA */}
      {(isQuoted && !isExpired) && (
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleAccept}>
            <Text style={styles.ctaButtonText}>Accept & Book</Text>
          </TouchableOpacity>
        </View>
      )}

      {isExpired && (
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.ctaButtonSecondary} onPress={handleReRequest}>
            <Text style={styles.ctaButtonSecondaryText}>Request New Quote</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  serviceName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusBadgePending: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusTextPending: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
  statusBadgeQuoted: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusTextQuoted: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065F46',
  },
  statusBadgeExpired: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusTextExpired: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991B1B',
  },
  statusBadgeAccepted: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusTextAccepted: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338CA',
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
  pendingNote: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
  },
  pendingNoteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  pendingNoteText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  expiryCard: {
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  expiryLabel: {
    fontSize: 14,
    color: '#991B1B',
    marginBottom: 4,
  },
  expiryTime: {
    fontSize: 28,
    fontWeight: '700',
    color: '#DC2626',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#4F46E5',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  expiredNote: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
  },
  expiredNoteText: {
    fontSize: 14,
    color: '#991B1B',
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
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  ctaButtonSecondary: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaButtonSecondaryText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4F46E5',
  },
});
