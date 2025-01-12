import { ClButton } from '@/components/ClButton'
import { ClIcon } from '@/components/ClIcon'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

export default function EmailPhoneAuthScreen() {
  const styles = useStyles()

  return (
    <ClPageView id="email-sent" contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        <ClIcon
          set={IconSet.MaterialIcon}
          name="check-circle"
          color={styles.icon.color}
          size={styles.icon.fontSize}
        />
        <ClText type="h3" weight="bold">
          Success!
        </ClText>
        <ClText dim style={{ textAlign: 'center' }}>
          Your password has been successfully reset! You can now use your new
          password to sign in to your account.
        </ClText>
      </View>
      <ClButton
        text="Sign in"
        onPress={() => router.replace('/auth/signin')}
        bodyStyle={{ marginTop: Spacing[4] }}
      />
    </ClPageView>
  )
}

const useStyles = createStyles(({ colors, spacing, sizes }) => ({
  container: {
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[20],
  },
  icon: {
    color: resolveColor(colors.states.success.base, colors.states.success[600]),
    fontSize: sizes.icon['3xl'],
  },
}))
