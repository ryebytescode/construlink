import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import type { IconType } from '@/types/icons'
import React, { type ReactElement } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { ClSpringAnimatedPressable } from './ClAnimated'
import { ClIcon } from './ClIcon'
import { ClText } from './ClText'

export interface ClMenuItem {
  title: string
  description?: string
  icon?: IconType
  right?: ReactElement
  onPress?: () => void
}

interface ClMenuProps {
  items: (ClMenuItem | null)[]
  containerStyle?: StyleProp<ViewStyle>
  hasBorders?: boolean
}

export function ClMenu(props: ClMenuProps) {
  useRenderCount('Menu')

  const { items, containerStyle, hasBorders = true } = props
  const styles = useStyles()

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        !hasBorders && { borderWidth: 0 },
      ]}
    >
      {items.map(
        (item, index) =>
          item && (
            // biome-ignore lint/suspicious/noArrayIndexKey:
            <MenuItem key={index} {...item} index={index} />
          )
      )}
    </View>
  )
}

function MenuItem({ index, onPress, ...item }: ClMenuItem & { index: number }) {
  const styles = useStyles()
  const Component = onPress ? ClSpringAnimatedPressable : View

  return (
    <Component
      style={[styles.item, !index && { borderTopWidth: 0 }]}
      onPress={onPress}
    >
      <View style={styles.left}>
        {item.icon && (
          <ClIcon
            set={item.icon.set}
            name={item.icon.name}
            color={styles.icon.color}
            size={styles.icon.fontSize}
          />
        )}
        <View>
          <ClText style={styles.title}>{item.title}</ClText>
          {item.description && (
            <ClText type="helper" dim>
              {item.description}
            </ClText>
          )}
        </View>
      </View>
      {item.right && <View style={styles.right}>{item.right}</View>}
    </Component>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  container: {
    overflow: 'hidden',
    backgroundColor: resolveColor(
      scheme,
      colors.neutral[800],
      colors.neutral[100]
    ),
    borderRadius: sizes.radius['2xl'],
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(scheme, colors.neutral[700], colors.neutral[200]),
  },
  item: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: sizes.borderWidth.thin,
    borderTopColor: resolveColor(
      scheme,
      colors.neutral[700],
      colors.neutral[200]
    ),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: typo.fontMap.semiBold,
  left: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'center',
  },
  right: {},
  icon: {
    color: resolveColor(scheme, colors.accent.base, colors.brand.base),
    fontSize: typo.sizes['2xl'].fontSize,
  },
}))
