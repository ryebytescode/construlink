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
      <Stack.Screen
        name="email-phone-auth"
        options={{ headerTitle: () => null }}
      />
    </ClStack>
  )
}
