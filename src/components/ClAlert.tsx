import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { IconSet, type IconType } from '@/types/icons'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { type ColorValue, Modal, View } from 'react-native'
import { ClButton } from './ClButton'
import { ClIcon } from './ClIcon'
import { ClText } from './ClText'

export enum AlertState {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

interface AlertButtonProps {
  text: string
  onPress?: () => void
}

interface ClAlertProps {
  visible?: boolean
  title?: string
  description?: string
  state?: AlertState
  secondaryButton?: AlertButtonProps
  primaryButton?: AlertButtonProps
}

export interface ClAlertHandleProps {
  show: (options?: Omit<ClAlertProps, 'visible'>) => void
  hide: (reset?: boolean) => void
}

const icons: Record<AlertState, IconType> = {
  success: {
    set: IconSet.MaterialCommunityIcons,
    name: 'check-circle-outline',
  },
  warning: {
    set: IconSet.MaterialIcon,
    name: 'error-outline',
  },
  error: {
    set: IconSet.MaterialIcon,
    name: 'dangerous',
  },
}

export const ClAlert = forwardRef<ClAlertHandleProps, ClAlertProps>(
  (props, ref) => {
    const [_options, setOptions] = useState<Omit<ClAlertProps, 'visible'>>({
      ...props,
      state: props.state ?? AlertState.SUCCESS,
    })
    const [isVisible, setIsVisible] = useState(props.visible ?? false)
    // biome-ignore lint/style/noNonNullAssertion:
    const styles = useStyles({ state: _options.state! })

    useImperativeHandle(ref, () => ({
      show(options) {
        if (options) setOptions((state) => ({ ...state, ...options }))

        setIsVisible(true)
      },
      hide() {
        setIsVisible(false)
      },
    }))

    return (
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        hardwareAccelerated={true}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.iconWrapper}>
            <ClIcon
              // biome-ignore lint/style/noNonNullAssertion:
              {...icons[_options.state!]}
              color={styles.icon.color}
              size={styles.icon.fontSize}
            />
          </View>
          <View style={styles.body}>
            <ClText weight="bold" style={styles.title}>
              {_options?.title}
            </ClText>
            {_options.description && (
              <ClText style={styles.description} dim>
                {_options?.description}
              </ClText>
            )}
            {(_options.secondaryButton || _options.primaryButton) && (
              <View style={styles.buttons}>
                {_options.secondaryButton && (
                  <ClButton
                    text={_options.secondaryButton.text}
                    bodyStyle={styles.button}
                    size="small"
                    variant="outline"
                    onPress={_options.secondaryButton.onPress}
                  />
                )}
                {_options.primaryButton && (
                  <ClButton
                    text={_options.primaryButton.text}
                    bodyStyle={styles.button}
                    size="small"
                    onPress={_options.primaryButton.onPress}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    )
  }
)

const useStyles = createStyles(
  (
    { scheme, sizes, colors, spacing, typo },
    { state }: { state: AlertState }
  ) => {
    const iconColors: Record<AlertState, ColorValue> = {
      success: resolveColor(
        colors.states.success[500],
        colors.states.success[700]
      ),
      warning: resolveColor(
        colors.states.warning[400],
        colors.states.warning[400]
      ),
      error: resolveColor(colors.states.danger[400], colors.states.danger[300]),
    }

    return {
      // backdrop: {
      //   backgroundColor: colors.modalBackground,
      // },
      modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.modalBackground,
      },
      iconWrapper: {
        borderTopLeftRadius: sizes.radius.full,
        borderTopRightRadius: sizes.radius.full,
        backgroundColor: resolveColor(colors.neutral[700], colors.white),
        padding: spacing[1],
        top: spacing[8],
        zIndex: 1,
      },
      icon: {
        color: iconColors[state],
        fontSize: sizes.icon['2xl'],
      },
      body: {
        width: '90%',
        backgroundColor: resolveColor(colors.neutral[700], colors.background),
        padding: spacing[4],
        borderRadius: sizes.radius['2xl'] + spacing[2],
        paddingTop: spacing[8],
      },
      title: {
        textAlign: 'center',
        marginBottom: spacing[4],
        fontSize: typo.sizes.lg.fontSize,
      },
      description: {
        textAlign: 'center',
      },
      buttons: {
        flexDirection: 'row',
        gap: spacing[4],
        marginTop: spacing[4],
      },
      button: {
        flex: 1,
      },
    }
  }
)
