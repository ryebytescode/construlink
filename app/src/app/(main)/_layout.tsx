import { ClStack } from '@/components/navigation/ClStack'
import { useRenderCount } from '@/hooks/useRenderCount'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient, onlineManager } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import * as Network from 'expo-network'
import { Stack } from 'expo-router'
import { DevToolsBubble } from 'react-native-react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

onlineManager.setEventListener((setOnline) => {
  const subscription = Network.addNetworkStateListener((state) =>
    setOnline(state?.isConnected || false)
  )

  return subscription.remove
})

export default function MainLayout() {
  useRenderCount('MainLayout')

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
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
        <Stack.Screen
          name="auth/signin"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="auth/forgot-password"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="auth/email-sent"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="auth/reset-password"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="auth/reset-done"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="auth/verification"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="auth/verification-done"
          options={{ headerTitle: () => null }}
        />

        <Stack.Screen name="user/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="user/dashboard-test"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="user/job/search"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="user/job/[jobId]"
          options={{ headerTitle: () => null }}
        />
      </ClStack>
      <DevToolsBubble />
    </PersistQueryClientProvider>
  )
}
