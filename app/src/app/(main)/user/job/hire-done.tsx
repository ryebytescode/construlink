import { ClButton } from '@/components/ClButton'
import { ClIcon } from '@/components/ClIcon'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import { router } from 'expo-router'
import { View } from 'react-native'

export default function HireDone() {
  const styles = useStyles()

  return (
    <ClPageView id="hire-done" contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        <ClIcon
          set={IconSet.MaterialIcon}
          name="check-circle"
          color={styles.icon.color}
          size={styles.icon.fontSize}
        />
        <ClText type="h3" weight="bold" style={{ textAlign: 'center' }}>
          Success!
        </ClText>
        <ClText dim style={{ textAlign: 'center' }}>
          Your hire request has been sent to the tradesperson. You will be
          notified of any updates.
        </ClText>
      </View>
      <View style={{ gap: Spacing[4], marginTop: Spacing[4] }}>
        <ClButton
          text="View My Requests"
          onPress={() => router.replace('/user/requests')}
        />
        <ClButton
          variant="outline"
          text="Back to Home"
          onPress={() => router.replace('/user/tradespeople')}
        />
      </View>
    </ClPageView>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes }) => ({
  container: {
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[20],
  },
  icon: {
    color: resolveColor(
      scheme,
      colors.states.success.base,
      colors.states.success[600]
    ),
    fontSize: sizes.icon['3xl'],
  },
}))
