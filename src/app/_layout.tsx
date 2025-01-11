import { useFirebaseInitializer } from '@/hooks/useFirebaseInitializer'
import { useRefresh } from '@/hooks/useRefresh'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useScheme } from '@/hooks/useScheme'
import { useAppStore } from '@/stores/app'
import { Palette } from '@/theme'
import * as NavigationBar from 'expo-navigation-bar'
import { NetworkStateType, useNetworkState } from 'expo-network'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { Fragment, useEffect } from 'react'
import { Alert, SafeAreaView } from 'react-native'
import 'react-native-reanimated'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 600,
  fade: true,
})

export default function RootLayout() {
  useRenderCount('RootLayout')

  const scheme = useScheme()
  const changeScheme = useAppStore((state) => state.changeScheme)
  const { refresh } = useRefresh()
  const isFirebaseInitializing = useFirebaseInitializer()
  const networkState = useNetworkState()

  useEffect(() => {
    changeScheme(scheme)

    SystemUI.setBackgroundColorAsync(Palette[scheme].background)
    NavigationBar.setBackgroundColorAsync(Palette[scheme].background)
    NavigationBar.setPositionAsync('relative')
  }, [scheme, changeScheme])

  useEffect(() => {
    if (!isFirebaseInitializing) SplashScreen.hideAsync()
  }, [isFirebaseInitializing])

  if (!networkState.isConnected) {
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

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
      <StatusBar style="auto" />
    </Fragment>
  )
}
