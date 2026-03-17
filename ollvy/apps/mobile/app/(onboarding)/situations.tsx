import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore, SITUATIONS, SituationId } from '../../store/onboarding';

export default function SituationsScreen() {
  const router = useRouter();
  const { situations, toggleSituation } = useOnboardingStore();

  const handleNext = () => {
    router.push('/(onboarding)/business-type');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 1 of 4</Text>
          <Text style={styles.title}>What's your situation?</Text>
          <Text style={styles.subtitle}>
            Select all that apply. This helps us recommend the right services for you.
          </Text>
        </View>

        <View style={styles.chipsContainer}>
          {SITUATIONS.map((situation) => {
            const isSelected = situations.includes(situation.id);
            return (
              <TouchableOpacity
                key={situation.id}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => toggleSituation(situation.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {situation.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, situations.length === 0 && styles.nextButtonDisabled]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {situations.length > 0 ? 'Continue' : 'Skip for now'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip onboarding</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 32,
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  chipSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  chipText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#6366F1',
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 24,
  },
  nextButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },
});
