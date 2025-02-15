import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useCallback, useEffect } from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import Animated, {
  runOnUI,
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
    const currentTab = tabOptions.find((item) => item.routeName === route.name)!
    const icon = isFocused ? currentTab.icon.filled : currentTab.icon.outline

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

    return (
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
    )
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
  const computeTabDim = useCallback((e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout

    highlighterDim.value = {
      width: Math.ceil(layout.width / state.routeNames.length),
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
    runOnUI(() => {
      'worklet'
      highlighterX.value = withSpring(
        highlighterDim.value.width * state.index,
        {
          duration: 800,
          stiffness: 20,
        }
      )
    })()
  }, [state.index])

  return (
    <View style={styles.tabBar} onLayout={computeTabDim}>
      <Animated.View style={[styles.tabHighlighter, highlighterAnimStyles]} />
      {RenderTabItems({
        state,
        descriptors,
        navigation,
        options,
        insets,
      })}
    </View>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: resolveColor(scheme, colors.neutral[900], 'white'),
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(scheme, colors.neutral[700], colors.neutral[200]),
    marginHorizontal: spacing[4],
    borderRadius: sizes.radius['2xl'],
    borderCurve: 'continuous',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: resolveColor(scheme, colors.neutral[800], colors.neutral[300]),
  },
  tabHighlighter: {
    backgroundColor: resolveColor(
      scheme,
      colors.accent[600],
      colors.brand[600]
    ),
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
