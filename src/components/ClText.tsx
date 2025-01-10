import { createStyles } from '@/helpers/createStyles'
import type { TextType, Weight } from '@/theme/typography'
import type { TextProps } from 'react-native'
import { Text as RNText } from 'react-native'

export interface ClTextProps extends TextProps {
  type: TextType
  weight: Weight
  dim: boolean
}

export function ClText(props: Partial<ClTextProps>) {
  const {
    type = 'paragraph',
    weight = 'regular',
    dim = false,
    style,
    children,
    ...rest
  } = props

  const styles = useStyles({ type, dim, weight })

  return (
    <RNText style={[styles.text, style]} {...rest}>
      {children}
    </RNText>
  )
}

const useStyles = createStyles(
  ({ colors, typo }, { type, weight, dim }: ClTextProps) => ({
    text: {
      ...typo.fontMap[weight],
      color: dim ? colors.secondaryText : colors.primaryText,
      fontSize: typo.presets[type].fontSize,
      lineHeight: typo.presets[type].lineHeight,
    },
  })
)
