import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useCallback, useEffect } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import Animated, {
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { type ClTabIcon, ClTabItem } from './ClTabItem'

export interface ClTabOption {
  routeName: string
  shown: boolean
  icon: ClTabIcon
}

const RenderTabItems = ({
  state,
  descriptors,
  navigation,
  options: tabOptions,
}: BottomTabBarProps & { options: ClTabOption[] }) => {
  return state.routes.map((route, index) => {
    const { options } = descriptors[route.key]
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
          ? options.title
          : route.name

    const isFocused = state.index === index
    const icon = isFocused
      ? tabOptions[index].icon.filled
      : tabOptions[index].icon.outline

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      })

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params)
      }
    }

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      })
    }

    return tabOptions[index].shown ? (
      <ClTabItem
        key={route.key}
        label={label}
        icon={icon}
        isFocused={isFocused}
        options={options}
        routeName={route.name}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    ) : null
  })
}

// https://reactnavigation.org/docs/bottom-tab-navigator#tabbar
export function ClTabBar({
  state,
  descriptors,
  navigation,
  insets,
  options,
}: BottomTabBarProps & { options: ClTabOption[] }) {
  useRenderCount('TabBar')

  const styles = useStyles()
  const highlighterDim = useSharedValue({ width: 0, height: 0 })
  const highlighterX = useSharedValue(0)
  // const visibleTabIndices = options
  //   .map(({ shown }, index) => (shown ? index : undefined))
  //   .filter((index) => index !== undefined)
  // const selectedVisibleTabIndex = visibleTabIndices.findIndex(
  //   (index) => index === state.index
  // )

  const computeTabDim = useCallback((e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout

    highlighterDim.value = {
      width: Math.ceil(layout.width / state.routes.length),
      height: Math.ceil(layout.height),
    }
  }, [])

  const highlighterAnimStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: highlighterX.value,
      },
    ],
    width: highlighterDim.value.width,
    height: highlighterDim.value.height,
  }))

  // Trigger sliding animation
  useEffect(() => {
    highlighterX.value = withSpring(highlighterDim.value.width * state.index, {
      duration: 800,
      stiffness: 20,
    })
  }, [state.index])

  return (
    <Animated.View
      style={styles.tabBar}
      onLayout={computeTabDim}
      entering={SlideInDown}
      exiting={SlideOutDown}
    >
      <Animated.View style={[styles.tabHighlighter, highlighterAnimStyles]} />
      {RenderTabItems({
        state,
        descriptors,
        navigation,
        options,
        insets,
      })}
    </Animated.View>
  )
}

const useStyles = createStyles(({ colors, spacing, sizes, typo }) => ({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: resolveColor(colors.neutral[800], 'white'),
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(colors.neutral[700], colors.neutral[200]),
    marginHorizontal: spacing[4],
    borderRadius: sizes.radius['2xl'],
    borderCurve: 'continuous',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: resolveColor(colors.neutral[800], colors.neutral[300]),
  },
  tabHighlighter: {
    backgroundColor: resolveColor(colors.accent[600], colors.brand[600]),
    position: 'absolute',
    left: 0,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[3],
    gap: spacing[1],
  },
  label: {
    color: colors.secondaryText,
    fontSize: typo.sizes.xs.fontSize,
    ...typo.fontMap.regular,
  },
}))
