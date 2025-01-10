import { forwardRef } from 'react'
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type View,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export const ClAnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface ClSpringAnimatedPressableProps extends PressableProps {
  duration?: number
}

export const ClSpringAnimatedPressable = forwardRef<
  View,
  ClSpringAnimatedPressableProps
>((props, ref) => {
  const { style, children, duration = 80, ...rest } = props

  const buttonScale = useSharedValue(1)
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        scale: buttonScale.value,
      },
    ],
  }))

  const onPressIn = (event: GestureResponderEvent) => {
    buttonScale.value = withTiming(0.96, { duration })

    if (props.onPressIn) props.onPressIn(event)
  }

  const onPressOut = (event: GestureResponderEvent) => {
    buttonScale.value = withTiming(1, { duration })

    if (props.onPressOut) props.onPressOut(event)
  }

  return (
    <ClAnimatedPressable
      {...rest}
      ref={ref}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[animatedStyles, style]}
    >
      {children}
    </ClAnimatedPressable>
  )
})
