import { ClBottomSheet } from '@/components/ClBottomSheet'
import { ClIcon } from '@/components/ClIcon'
import { ClMenu } from '@/components/ClMenu'
import { ClSpinner } from '@/components/ClSpinner'
import { ClStack } from '@/components/navigation/ClStack'
import { useAuth } from '@/contexts/auth'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import {
  type BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { Stack, router, useSegments } from 'expo-router'
import { useEffect, useRef } from 'react'
import { TouchableOpacity } from 'react-native'

export default function UserLayout() {
  useRenderCount('UserLayout')

  const styles = useStyles()
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  // const { userInfo, initializing } = useAuth()
  // const segments = useSegments()

  // useEffect(() => {
  //     if (!userInfo && segments[1] === 'user') {
  //         router.replace('/')

  //         if (router.canDismiss())
  //             router.dismissAll()
  //     }
  // }, [userInfo])

  // if (initializing || !userInfo) {
  //     return <ClSpinner visible />
  // }

  return (
    <>
      <ClStack id="user">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="[userId]" options={{ headerTitle: () => null }} />
        <Stack.Screen
          name="messages/[threadId]"
          options={{ title: 'Message', animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="dashboard-test"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="settings/index"
          options={{ title: 'Account Settings' }}
        />
        <Stack.Screen
          name="settings/account"
          options={{ title: 'Account & Security' }}
        />
        <Stack.Screen
          name="settings/edit/display-name"
          options={{ title: 'Display Name', animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="job/search"
          options={{ headerTitle: () => null, animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="job/[jobId]"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen name="job/apply" options={{ title: 'Apply Job' }} />
        <Stack.Screen
          name="job/apply-done"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="job/hire-done"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen
          name="job/view-application"
          options={{ title: 'Application Details' }}
        />
        <Stack.Screen
          name="job/create"
          options={{ title: 'Create Job Post' }}
        />
        <Stack.Screen
          name="job/description-editor"
          options={{ title: 'Edit', animation: 'fade_from_bottom' }}
        />
        <Stack.Screen name="job/preview" options={{ title: 'Preview' }} />
        <Stack.Screen
          name="job/submitted"
          options={{ headerTitle: () => null }}
        />
        <Stack.Screen name="job/search-results" />
        <Stack.Screen
          name="job/category-finder"
          options={{ title: 'Select Job Type' }}
        />
        <Stack.Screen
          name="job/view-hire-request"
          options={{ title: 'View Hire Request' }}
        />
        <Stack.Screen name="job/hire" options={{ title: 'Hire' }} />
        <Stack.Screen
          name="company/create"
          options={{ title: 'Create Company' }}
        />
        <Stack.Screen name="requests" options={{ title: 'Hires' }} />
        <Stack.Screen name="saved" options={{ title: 'Saved' }} />
        <Stack.Screen
          name="notifications"
          options={{ title: 'Notifications' }}
        />
      </ClStack>
    </>
  )
}

const useStyles = createStyles(({ scheme, colors, sizes, spacing }) => ({
  sceneContainer: {
    backgroundColor: colors.background,
  },
  headerRightContainer: {
    paddingRight: spacing[4],
  },
  settingsIcon: {
    color: resolveColor(scheme, colors.accent.base, colors.brand.base),
    fontSize: sizes.icon.md,
  },
}))
