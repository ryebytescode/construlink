import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useAppStore } from '@/stores/app'
import { Spacing } from '@/theme'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

interface ClSpinnerProps {
  transluscent?: boolean
  visible?: boolean
}

export interface ClSpinnerHandleProps {
  show: () => void
  hide: () => void
}

export const ClInlineSpinner = forwardRef<ClSpinnerHandleProps, ClSpinnerProps>(
  ({ transluscent, visible }, ref) => {
    const styles = useStyles({ transluscent })
    const colors = useAppStore((state) => state.colors)
    const [isVisible, setIsVisible] = useState(visible ?? false)

    useImperativeHandle(ref, () => ({
      show() {
        setIsVisible(true)
      },
      hide() {
        setIsVisible(false)
      },
    }))

    return isVisible ? (
      <Animated.View
        style={styles.container}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <ActivityIndicator
          size={Spacing[20]}
          color={resolveColor(colors.accent[500], colors.brand[500])}
        />
      </Animated.View>
    ) : null
  }
)

const useStyles = createStyles(
  ({ colors }, { transluscent }: { transluscent?: boolean }) => ({
    container: {
      backgroundColor: transluscent
        ? colors.modalBackground
        : colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 12,
    },
  })
)
