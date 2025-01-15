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

export default function VerificationDoneScreen() {
  const styles = useStyles()

  return (
    <ClPageView id="verification-done" contentContainerStyle={{ flex: 1 }}>
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
          You've successfully verified your email address.
        </ClText>
      </View>
      <ClButton
        text="Continue"
        onPress={() => router.replace('/user/home')}
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
