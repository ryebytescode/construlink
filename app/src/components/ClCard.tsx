import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import type { PropsWithChildren, ReactNode } from 'react'
import React from 'react'
import {
  type PressableProps,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native'
import { ClSpringAnimatedPressable } from './ClAnimated'

interface ClCardProps extends PropsWithChildren {
  onPress?: PressableProps['onPress']
  header?: ReactNode
  footer?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function ClCard({
  onPress,
  children,
  header,
  footer,
  style,
}: ClCardProps) {
  const styles = useStyles()

  const contents = () => {
    return (
      <>
        {header && (
          <View style={[styles.section, styles.hasBottomBorder]}>{header}</View>
        )}
        <View style={styles.section}>{children}</View>
        {footer && (
          <View style={[styles.section, styles.hasTopBorder]}>{footer}</View>
        )}
      </>
    )
  }

  if (onPress) {
    return (
      <ClSpringAnimatedPressable onPress={onPress} style={[styles.card, style]}>
        {contents}
      </ClSpringAnimatedPressable>
    )
  }

  return <View style={styles.card}>{contents()}</View>
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  card: {
    backgroundColor: resolveColor(
      scheme,
      colors.neutral[800],
      colors.neutral[100]
    ),
    borderRadius: sizes.radius['2xl'],
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(scheme, colors.neutral[700], colors.neutral[200]),
  },
  section: {
    gap: spacing[4],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  hasTopBorder: {
    borderTopWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(scheme, colors.neutral[700], colors.neutral[200]),
  },
  hasBottomBorder: {
    borderBottomWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(scheme, colors.neutral[700], colors.neutral[200]),
  },
}))
