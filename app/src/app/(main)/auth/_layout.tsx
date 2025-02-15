import { ClStack } from '@/components/navigation/ClStack'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Stack } from 'expo-router'

export default function AuthLayout() {
  useRenderCount('AuthLayout')

  return (
    <ClStack id="auth">
      <Stack.Screen
        name="role-selection"
        options={{ headerTitle: () => null }}
      />
      <Stack.Screen
        name="method-chooser"
        options={{ headerTitle: () => null }}
      />
      <Stack.Screen name="signin" options={{ headerTitle: () => null }} />
      <Stack.Screen name="signup" options={{ headerTitle: () => null }} />
      <Stack.Screen
        name="forgot-password"
        options={{ headerTitle: () => null }}
      />
      <Stack.Screen name="email-sent" options={{ headerTitle: () => null }} />
      <Stack.Screen
        name="reset-password"
        options={{ headerTitle: () => null }}
      />
      <Stack.Screen name="reset-done" options={{ headerTitle: () => null }} />
      <Stack.Screen name="verification" options={{ headerTitle: () => null }} />
      <Stack.Screen
        name="verification-done"
        options={{ headerTitle: () => null }}
      />
    </ClStack>
  )
}
