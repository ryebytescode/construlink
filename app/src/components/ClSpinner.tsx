import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useAppStore } from '@/stores/app'
import { Spacing } from '@/theme'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { ActivityIndicator, Modal, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ClSpinnerProps {
  transluscent?: boolean
  visible?: boolean
}

export interface ClSpinnerHandleProps {
  show: () => void
  hide: () => void
}

export const ClSpinner = forwardRef<ClSpinnerHandleProps, ClSpinnerProps>(
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

    return (
      <SafeAreaView>
        <Modal
          visible={isVisible}
          transparent={true}
          animationType="fade"
          hardwareAccelerated={true}
          statusBarTranslucent
        >
          <View style={styles.container}>
            <ActivityIndicator
              size={Spacing[20]}
              color={resolveColor(colors.accent[500], colors.brand[500])}
            />
          </View>
        </Modal>
      </SafeAreaView>
    )
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
      top: 0,
      left: 0,
      zIndex: 99999,
      width: '100%',
      height: '100%',
    },
  })
)
