import { ClStack } from '@/components/navigation/ClStack'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Stack } from 'expo-router'

export default function MainLayout() {
  useRenderCount('MainLayout')

  return (
    <ClStack id="main">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth/role-selection"
        options={{ headerTitle: () => null }}
      />
      <Stack.Screen
        name="auth/method-chooser"
        options={{ headerTitle: () => null }}
      />
      <Stack.Screen name="auth/signin" options={{ headerTitle: () => null }} />
      <Stack.Screen name="auth/signup" options={{ headerTitle: () => null }} />
    </ClStack>
  )
}
