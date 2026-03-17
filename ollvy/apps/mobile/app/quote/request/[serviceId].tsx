// U10 Quote Request Form
// Spec:
// - Business details, state, specific requirements
// - Inserts quote_requests row (status=pending)
// - Admin notified via badge

import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase, getEdgeFunctionUrl } from '../../../lib/supabase';
import { useAuthStore } from '../../../store/auth';

// Indian states list
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

interface ServicePackage {
  id: string;
  name: string;
  short_description: string;
  price_varies_by_state: boolean;
}

export default function QuoteRequestScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const { session, user } = useAuthStore();

  const [service, setService] = useState<ServicePackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [state, setState] = useState(user?.state || '');
  const [city, setCity] = useState(user?.city || '');
  const [businessName, setBusinessName] = useState(user?.business_name || '');
  const [requirements, setRequirements] = useState('');
  const [gstRegistered, setGstRegistered] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    if (!serviceId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_packages')
        .select('id, name, short_description, price_varies_by_state')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data);
    } catch (err) {
      console.error('Failed to fetch service:', err);
      Alert.alert('Error', 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!state) {
      Alert.alert('Required', 'Please select your state');
      return;
    }

    if (!businessName.trim()) {
      Alert.alert('Required', 'Please enter your business name');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(getEdgeFunctionUrl('create-quote-request'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          service_package_id: serviceId,
          submitted_details: {
            state,
            city,
            business_name: businessName,
            requirements,
            gst_registered: gstRegistered,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      Alert.alert(
        'Quote Request Submitted',
        'We will review your request and get back to you with a quote within 24 hours.',
        [
          {
            text: 'View Quote',
            onPress: () => router.replace(`/quote/${data.quote_request.id}`),
          },
        ]
      );
    } catch (err: any) {
      console.error('Failed to submit quote request:', err);
      Alert.alert('Error', err.message || 'Failed to submit quote request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Get Quote', headerBackTitle: 'Back' }} />
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
          title: 'Get Quote',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.short_description}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Your Details</Text>

          {/* Business Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Enter your business name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* State Selector */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>State *</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowStatePicker(!showStatePicker)}
            >
              <Text style={state ? styles.selectText : styles.selectPlaceholder}>
                {state || 'Select your state'}
              </Text>
            </TouchableOpacity>
            {showStatePicker && (
              <ScrollView style={styles.statePicker} nestedScrollEnabled>
                {INDIAN_STATES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.stateOption, state === s && styles.stateOptionSelected]}
                    onPress={() => {
                      setState(s);
                      setShowStatePicker(false);
                    }}
                  >
                    <Text style={[styles.stateOptionText, state === s && styles.stateOptionTextSelected]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* City */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter your city"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* GST Registered Toggle */}
          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setGstRegistered(!gstRegistered)}
            >
              <View style={[styles.checkbox, gstRegistered && styles.checkboxChecked]}>
                {gstRegistered && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>I am GST registered</Text>
            </TouchableOpacity>
          </View>

          {/* Specific Requirements */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Specific Requirements</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={requirements}
              onChangeText={setRequirements}
              placeholder="Any specific details or requirements..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>
            We'll review your details and send you a customized quote within 24 hours.
            The quote will be valid for 48 hours.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.ctaButton, submitting && styles.ctaButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaButtonText}>Submit Quote Request</Text>
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
  serviceInfo: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  selectInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectText: {
    fontSize: 16,
    color: '#111827',
  },
  selectPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  statePicker: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
  },
  stateOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stateOptionSelected: {
    backgroundColor: '#EEF2FF',
  },
  stateOptionText: {
    fontSize: 15,
    color: '#374151',
  },
  stateOptionTextSelected: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  checkboxRow: {
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
  checkboxLabel: {
    fontSize: 15,
    color: '#374151',
  },
  infoNote: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  infoNoteText: {
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
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});
