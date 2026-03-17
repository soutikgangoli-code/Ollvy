import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../store/auth';

// Keep splash screen visible while loading auth state
SplashScreen.preventAutoHideAsync();

function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const { session, user, isLoading, isNewUser } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!session) {
      // Not authenticated - redirect to login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (isNewUser || (user && !user.business_type)) {
      // Authenticated but needs onboarding
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)/situations');
      }
    } else {
      // Authenticated and onboarded - go to main app
      if (!inTabsGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [session, user, isLoading, isNewUser, segments]);
}

export default function RootLayout() {
  const { refreshSession, isLoading } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app load
    refreshSession().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  // Use protected route hook
  useProtectedRoute();

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
