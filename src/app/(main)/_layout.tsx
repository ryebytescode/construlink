import { ClStack } from '@/components/navigation/ClStack'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Stack } from 'expo-router'

export default function MainLayout() {
  useRenderCount('MainLayout')

  return (
    <ClStack id="main">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </ClStack>
  )
}
