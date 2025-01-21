import { createStyles } from '@/helpers/createStyles'
import type { IconType } from '@/types/icons'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { ClIcon } from './ClIcon'
import { ClText, type ClTextProps } from './ClText'

interface ClIconTextProps extends Partial<ClTextProps> {
  icon: IconType
  text: string | ReactNode
}

export function ClIconText({ icon, text, ...rest }: ClIconTextProps) {
  const styles = useStyles()

  return (
    <View style={styles.row}>
      <ClIcon {...icon} size={styles.icon.size} color={styles.icon.color} />
      <View style={styles.textWrapper}>
        <ClText type="helper" {...rest}>
          {text}
        </ClText>
      </View>
    </View>
  )
}

const useStyles = createStyles(({ colors, spacing, sizes, typo }) => ({
  row: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'center',
  },
  icon: {
    color: colors.primaryText,
    size: sizes.icon.sm,
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}))
