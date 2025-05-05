import { ClAuthProvider } from '@/contexts/auth'
import { ClThemeProvider } from '@/contexts/theme'
import { useRenderCount } from '@/hooks/useRenderCount'
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient, onlineManager } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useMount } from 'ahooks'
import * as Font from 'expo-font'
import * as Network from 'expo-network'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-get-random-values'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { DevToolsBubble } from 'react-native-react-query-devtools'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 800,
  fade: true,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

onlineManager.setEventListener((setOnline) => {
  const subscription = Network.addNetworkStateListener((state) =>
    setOnline(state?.isConnected || false)
  )

  return subscription.remove
})

export default function RootLayout() {
  useRenderCount('RootLayout')

  useMount(() => {
    async function loadResources() {
      try {
        // Cache icons
        await Font.loadAsync({
          ...MaterialIcons.font,
          ...MaterialCommunityIcons.font,
          ...Ionicons.font,
          ...AntDesign.font,
        })
      } catch (error) {
        if (__DEV__) console.warn(error)
      } finally {
        SplashScreen.hideAsync()
      }
    }

    loadResources()
  })

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <KeyboardProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
          >
            <ClAuthProvider>
              <ClThemeProvider>
                <Slot />
              </ClThemeProvider>
            </ClAuthProvider>
            <DevToolsBubble />
          </PersistQueryClientProvider>
          <StatusBar style="auto" />
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
