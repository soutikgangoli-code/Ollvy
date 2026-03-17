import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="situations" />
      <Stack.Screen name="business-type" />
      <Stack.Screen name="state" />
      <Stack.Screen name="recommendations" />
    </Stack>
  );
}
