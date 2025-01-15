import { ClSpinner } from '@/components/ClSpinner'
import { useRefresh } from '@/hooks/useRefresh'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useScheme } from '@/hooks/useScheme'
import { Role } from '@/lib/constants'
import { UserCollection } from '@/services/firestore'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { Palette } from '@/theme'
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import auth from '@react-native-firebase/auth'
import * as Font from 'expo-font'
import * as NavigationBar from 'expo-navigation-bar'
import { NetworkStateType, useNetworkState } from 'expo-network'
import { Slot, router, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { Fragment, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

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
  const { user, role, setUser, setRole } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      role: state.role,
      setUser: state.setUser,
      setRole: state.setRole,
    }))
  )
  const { refresh } = useRefresh()
  const networkState = useNetworkState()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined = undefined

    async function initialize() {
      unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          setUser(currentUser)
          setRole(await UserCollection.getRole(currentUser.uid))
        }
      })

      try {
        // Cache fonts
        await Font.loadAsync({
          ...MaterialIcons.font,
          ...MaterialCommunityIcons.font,
          ...Ionicons.font,
          ...AntDesign.font,
        })
      } catch (error) {
        if (__DEV__) console.warn(error)
      } finally {
        setIsReady(true)
      }
    }

    initialize()

    return unsubscribe
  }, [])

  useEffect(() => {
    changeScheme(scheme)

    SystemUI.setBackgroundColorAsync(Palette[scheme].background)
    NavigationBar.setBackgroundColorAsync(Palette[scheme].background)
    NavigationBar.setPositionAsync('relative')
  }, [scheme, changeScheme])

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().then(() => {
        if (user && role) {
          if (router.canDismiss()) router.dismissAll()
          router.replace(
            role === Role.EMPLOYER ? '/user/tradespeople' : '/user/jobs'
          )
        } else if (!user && segments[1] === 'user') {
          router.replace('/')
        }
      })
    }
  }, [isReady, user, role])

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

  if (!isReady) return <ClSpinner />

  return (
    <Fragment>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </Fragment>
  )
}
