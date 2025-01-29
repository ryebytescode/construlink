import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useAppStore } from '@/stores/app'
import { Spacing } from '@/theme'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size={Spacing[20]}
          color={resolveColor(colors.accent[500], colors.brand[500])}
        />
      </SafeAreaView>
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
      flex: 1,
    },
  })
)
