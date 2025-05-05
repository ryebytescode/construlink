import { ClSpinner } from '@/components/ClSpinner'
import { ClStack } from '@/components/navigation/ClStack'
import { useAuth } from '@/contexts/auth'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Role } from '@/lib/constants'
import { registerForPushNotificationsAsync } from '@/services/notifications'
import { Toasts } from '@backpackapp-io/react-native-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useUpdateEffect } from 'ahooks'
import * as Notifications from 'expo-notifications'
import { Stack, router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function MainLayout() {
  useRenderCount('MainLayout')

  const styles = useStyles()
  const { initializing, userInfo } = useAuth()
  const queryClient = useQueryClient()
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined)
  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  useQuery({
    queryKey: ['expoPushToken'],
    queryFn: async () => {
      const token = await registerForPushNotificationsAsync()
      return token
    },
  })

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  useUpdateEffect(() => {
    if (!initializing && userInfo?.role === Role.TRADESPERSON) {
      router.replace('/user/jobs')
    } else if (!initializing && userInfo?.role === Role.EMPLOYER) {
      router.replace('/user/tradespeople')
    }
  }, [initializing, userInfo])

  if (initializing) {
    return <ClSpinner visible />
  }

  return (
    <>
      <ClStack id="main" initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="user" options={{ headerShown: false }} />
      </ClStack>
      <Toasts
        defaultStyle={{
          pressable: styles.toastPressable,
          text: styles.toastText,
        }}
      />
    </>
  )
}

const useStyles = createStyles(({ scheme, colors, typo, sizes }) => ({
  toastPressable: {
    backgroundColor: resolveColor(
      scheme,
      colors.neutral[600],
      colors.neutral[100]
    ),
    borderRadius: sizes.radius['2xl'],
  },
  toastText: {
    ...typo.fontMap.semiBold,
    color: colors.primaryText,
  },
}))
