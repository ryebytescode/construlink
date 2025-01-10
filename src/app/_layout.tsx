import { useRenderCount } from '@/hooks/useRenderCount'
import { useScheme } from '@/hooks/useScheme'
import { useAppStore } from '@/stores/app'
import { Palette } from '@/theme'
import * as NavigationBar from 'expo-navigation-bar'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { Fragment, useEffect } from 'react'
import { SafeAreaView } from 'react-native'
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

  useEffect(() => {
    changeScheme(scheme)

    SystemUI.setBackgroundColorAsync(Palette[scheme].background)
    NavigationBar.setBackgroundColorAsync(Palette[scheme].background)
    NavigationBar.setPositionAsync('relative')
  }, [scheme, changeScheme])

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
      <StatusBar style="auto" />
    </Fragment>
  )
}
