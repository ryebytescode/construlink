import { ClIcon } from '@/components/ClIcon'
import {
  ClInlineSpinner,
  type ClSpinnerHandleProps,
} from '@/components/ClInlineSpinner'
import { ClMenu, type ClMenuItem } from '@/components/ClMenu'
import { ClPageView } from '@/components/ClPageView'
import { resolveColor } from '@/helpers/resolveColor'
import { User } from '@/services/firebase'
import { Palette, Sizes } from '@/theme'
import { IconSet } from '@/types/icons'
import { router } from 'expo-router'
import React, { useMemo, useRef } from 'react'
import { TouchableOpacity } from 'react-native'

const editElement = (onPress: () => void) => (
  <TouchableOpacity onPress={onPress}>
    <ClIcon
      set={IconSet.MaterialCommunityIcons}
      name="pencil-outline"
      size={Sizes.icon.md}
      color={resolveColor(Palette.dark.neutral[400], Palette.dark.primaryText)}
    />
  </TouchableOpacity>
)

export default function AccountScreen() {
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const menuItems: ClMenuItem[] = useMemo(
    () => [
      {
        title: 'Display Name',
        description: (User.getDisplayName(true) as string) || 'Not set',
        right: editElement(() =>
          router.push('/user/settings/edit/display-name')
        ),
      },
      {
        title: 'Email',
        description: 'john@gmail.com',
        // right: editElement,
      },
      {
        title: 'Phone',
        description: '+63 912 345 6789',
        // right: editElement,
      },
    ],
    []
  )

  return (
    <>
      <ClPageView
        id="settings"
        contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
      >
        <ClMenu items={menuItems} />
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} transluscent />
    </>
  )
}
