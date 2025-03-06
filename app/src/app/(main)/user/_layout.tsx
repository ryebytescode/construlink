import { ClSpinner } from '@/components/ClSpinner'
import { ClStack } from '@/components/navigation/ClStack'
import { useAuth } from '@/contexts/auth'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Stack, router, useSegments } from 'expo-router'
import { useEffect } from 'react'

export default function UserLayout() {
  useRenderCount('UserLayout')

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
    <ClStack id="user">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
      <Stack.Screen name="job/[jobId]" options={{ headerTitle: () => null }} />
      <Stack.Screen name="job/apply" options={{ title: 'Apply Job' }} />
      <Stack.Screen
        name="job/apply-done"
        options={{ headerTitle: () => null }}
      />
      <Stack.Screen
        name="job/view-application"
        options={{ title: 'Application Details' }}
      />
      <Stack.Screen name="job/create" options={{ title: 'Create Job Post' }} />
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
        name="company/create"
        options={{ title: 'Create Company' }}
      />
    </ClStack>
  )
}
