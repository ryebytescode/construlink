import { ClSpinner } from '@/components/ClSpinner'
import { useFirebaseInitializer } from '@/hooks/useFirebaseInitializer'
import { useRefresh } from '@/hooks/useRefresh'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useScheme } from '@/hooks/useScheme'
import { useAppStore } from '@/stores/app'
import { Palette } from '@/theme'
import * as NavigationBar from 'expo-navigation-bar'
import { NetworkStateType, useNetworkState } from 'expo-network'
import { Slot, router, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { Fragment, useEffect } from 'react'
import { Alert } from 'react-native'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 600,
  fade: true,
})

export default function RootLayout() {
  useRenderCount('RootLayout')

  const scheme = useScheme()
  const segments = useSegments()
  const changeScheme = useAppStore((state) => state.changeScheme)
  const { refresh } = useRefresh()
  const { isInitializing, hasUser } = useFirebaseInitializer()
  const networkState = useNetworkState()

  useEffect(() => {
    changeScheme(scheme)

    SystemUI.setBackgroundColorAsync(Palette[scheme].background)
    NavigationBar.setBackgroundColorAsync(Palette[scheme].background)
    NavigationBar.setPositionAsync('relative')
  }, [scheme, changeScheme])

  useEffect(() => {
    if (!isInitializing) {
      SplashScreen.hideAsync().then(() => {
        if (hasUser) {
          if (router.canDismiss()) router.dismissAll()
          router.replace('/user/home')
        } else if (!hasUser && segments[0] === 'user') {
          router.replace('/')
        }
      })
    }
  }, [isInitializing, hasUser])

  if (networkState.type === NetworkStateType.NONE) {
    Alert.alert(
      "You're offline",
      "It seems like there's no internet connection. Please check your network settings and try again.",
      [
        {
          text: 'Retry',
          isPreferred: true,
          onPress: refresh,
        },
      ],
      {
        cancelable: false,
      }
    )
  }

  if (isInitializing) return <ClSpinner />

  return (
    <Fragment>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </Fragment>
  )
}
