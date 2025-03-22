import { ClBottomSheet } from '@/components/ClBottomSheet'
import { ClButton } from '@/components/ClButton'
import {
  ClInlineSpinner,
  type ClSpinnerHandleProps,
} from '@/components/ClInlineSpinner'
import { ClMenu, type ClMenuItem } from '@/components/ClMenu'
import { ClPageView } from '@/components/ClPageView'
import { ClRadioInput } from '@/components/ClRadio'
import { useAuth } from '@/contexts/auth'
import { User } from '@/services/firebase'
import { useAppStore } from '@/stores/app'
import { Spacing } from '@/theme'
import type { Scheme } from '@/theme/palette'
import { IconSet } from '@/types/icons'
import {
  type BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import React, { useMemo, useRef } from 'react'
import { Alert } from 'react-native'

export default function SettingsScreen() {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  const auth = useAuth()

  const menuItems: ClMenuItem[] = useMemo(
    () => [
      {
        title: 'Account & Security',
        icon: {
          set: IconSet.MaterialCommunityIcons,
          name: 'account-outline',
        },
        onPress: () => router.navigate('/user/settings/account'),
      },
      {
        title: 'Notifications',
        icon: {
          set: IconSet.Ionicons,
          name: 'notifications-outline',
        },
        //   onPress: () => router.navigate('/(main)/(user)/notifications'),
      },
      {
        title: 'Theme',
        icon: {
          set: IconSet.MaterialCommunityIcons,
          name: 'theme-light-dark',
        },
        onPress: () => bottomSheetRef.current?.present(),
      },
      {
        title: 'Feedback',
        icon: {
          set: IconSet.MaterialCommunityIcons,
          name: 'message-outline',
        },
        //   onPress: () => router.navigate('/(main)/(user)/feedback'),
      },
      {
        title: 'Terms & Policies',
        icon: {
          set: IconSet.MaterialCommunityIcons,
          name: 'information-outline',
        },
        //   onPress: () => router.navigate('/(main)/(legal)/terms'),
      },
    ],
    []
  )
  const currentScheme = useAppStore((state) => state.scheme)
  const changeScheme = useAppStore((state) => state.changeScheme)

  function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          spinnerRef.current?.show()
          await User.signOut()
          auth.reset()
          if (router.canDismiss()) router.dismissAll()
          router.replace('/')
        },
      },
    ])
  }

  return (
    <BottomSheetModalProvider>
      <ClPageView
        id="settings"
        contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
      >
        <ClMenu items={menuItems} />
        <ClButton text="Sign out" onPress={handleSignOut} />
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} transluscent />
      <ClBottomSheet ref={bottomSheetRef} enableDynamicSizing={true}>
        <ClRadioInput
          id="role"
          options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]}
          value={currentScheme}
          onChange={(value) => changeScheme(value as Scheme)}
          contentContainerStyle={{ padding: Spacing[4] }}
        />
      </ClBottomSheet>
    </BottomSheetModalProvider>
  )
}
