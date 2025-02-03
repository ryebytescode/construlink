import { ClStack } from '@/components/navigation/ClStack'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Toasts } from '@backpackapp-io/react-native-toast'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
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
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
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

  const styles = useStyles()

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <BottomSheetModalProvider>
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
            name="user/settings/index"
            options={{ title: 'Account Settings' }}
          />
          <Stack.Screen
            name="user/settings/account"
            options={{ title: 'Account & Security' }}
          />
          <Stack.Screen
            name="user/settings/edit/display-name"
            options={{ title: 'Display Name', animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="user/job/search"
            options={{ headerTitle: () => null, animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="user/job/[jobId]"
            options={{ headerTitle: () => null }}
          />
          <Stack.Screen
            name="user/job/apply"
            options={{ title: 'Apply Job' }}
          />
          <Stack.Screen
            name="user/job/apply-done"
            options={{ headerTitle: () => null }}
          />
          <Stack.Screen
            name="user/job/view-application"
            options={{ title: 'Application Details' }}
          />
          <Stack.Screen
            name="user/job/create"
            options={{ title: 'Create Job Post' }}
          />
          <Stack.Screen
            name="user/job/description-editor"
            options={{ title: 'Job Details' }}
          />
        </ClStack>
        <Toasts
          defaultStyle={{
            pressable: styles.toastPressable,
            text: styles.toastText,
          }}
        />
      </BottomSheetModalProvider>
      <DevToolsBubble />
    </PersistQueryClientProvider>
  )
}

const useStyles = createStyles(({ colors, typo, sizes }) => ({
  toastPressable: {
    backgroundColor: resolveColor(colors.neutral[600], colors.neutral[100]),
    borderRadius: sizes.radius['2xl'],
  },
  toastText: {
    ...typo.fontMap.semiBold,
    color: colors.primaryText,
  },
}))
