import { ClButton } from '@/components/ClButton'
import { ClIcon } from '@/components/ClIcon'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { IconSet } from '@/types/icons'
import { router } from 'expo-router'
import { View } from 'react-native'

export default function CreateJobConfirmation() {
  const styles = useStyles()

  return (
    <ClPageView id="create-job-confirmation">
      <View style={styles.container}>
        <ClIcon
          set={IconSet.MaterialCommunityIcons}
          name="check-circle-outline"
          color={styles.icon.color}
          size={styles.icon.fontSize}
        />
        <ClText type="h3" weight="bold">
          Success!
        </ClText>
        <ClText dim style={{ textAlign: 'center' }}>
          Your job post has been submitted and is now under review. You'll be
          notified once it's approved and visible to tradespeople.
        </ClText>
      </View>
      <ClButton
        text="Go to My Posts"
        onPress={() => router.replace('/user/posts')}
      />
    </ClPageView>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, typo, sizes }) => ({
  container: {
    alignItems: 'center',
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  icon: {
    color: resolveColor(
      scheme,
      colors.states.success.base,
      colors.states.success[600]
    ),
    fontSize: sizes.icon['4xl'],
  },
}))
