import { ClSpinner } from '@/components/ClSpinner'
import { ClStack } from '@/components/navigation/ClStack'
import { useAuth } from '@/contexts/auth'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Role } from '@/lib/constants'
import { Toasts } from '@backpackapp-io/react-native-toast'
import { useUpdateEffect } from 'ahooks'
import { Stack, router } from 'expo-router'

export default function MainLayout() {
  useRenderCount('MainLayout')

  const styles = useStyles()
  const { initializing, userInfo } = useAuth()

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
