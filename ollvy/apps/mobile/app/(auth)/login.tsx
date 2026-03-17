import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { sendOtp, isLoading, lastOtpError, retryAfter, remainingAttempts } = useAuthStore();

  // Validate Indian mobile number (10 digits starting with 6-9)
  const isValidPhone = /^[6-9]\d{9}$/.test(phone);

  const handleSendOtp = async () => {
    if (!isValidPhone) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError(null);
    const result = await sendOtp(phone);

    if (result.sent) {
      // Navigate to OTP screen with phone number
      router.push({
        pathname: '/(auth)/otp',
        params: { phone },
      });
    } else if (result.error === 'RATE_LIMITED') {
      setError(`Too many attempts. Try again in ${formatRetryTime(result.retryAfter || 0)}`);
    } else {
      setError(result.message || 'Failed to send OTP');
    }
  };

  const formatRetryTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const handlePhoneChange = (text: string) => {
    // Only allow digits, max 10
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>Ollvy</Text>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>
              Enter your mobile number to get started
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.prefixContainer}>
                <Text style={styles.prefix}>+91</Text>
              </View>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="Enter mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
                editable={!isLoading}
              />
            </View>

            {error && (
              <Text style={styles.error}>{error}</Text>
            )}

            {retryAfter && retryAfter > 0 && (
              <Text style={styles.rateLimitInfo}>
                Rate limited. Try again in {formatRetryTime(retryAfter)}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                (!isValidPhone || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleSendOtp}
              disabled={!isValidPhone || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>

            {remainingAttempts !== null && remainingAttempts <= 2 && (
              <Text style={styles.attemptsWarning}>
                {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 60,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6366F1',
    marginBottom: 24,
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
  form: {
    marginTop: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  prefixContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    justifyContent: 'center',
  },
  prefix: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    color: '#111827',
    letterSpacing: 1,
  },
  error: {
    marginTop: 8,
    color: '#EF4444',
    fontSize: 14,
  },
  rateLimitInfo: {
    marginTop: 8,
    color: '#F59E0B',
    fontSize: 14,
  },
  attemptsWarning: {
    marginTop: 12,
    textAlign: 'center',
    color: '#F59E0B',
    fontSize: 14,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#C7D2FE',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginBottom: 32,
  },
  footerText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 22,
  },
  link: {
    color: '#6366F1',
    fontWeight: '500',
  },
});
