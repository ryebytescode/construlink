import { createHTML } from '@/helpers/createHTML'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { Spacing, Styled } from '@/theme'
import { type Href, router } from 'expo-router'
import type { ElementType } from 'react'
import {
  Platform,
  type StyleProp,
  type TouchableOpacityProps,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native'
import WebView from 'react-native-webview'
import { ClSpringAnimatedPressable } from './ClAnimated'
import { ClSpinner } from './ClSpinner'
import { ClText } from './ClText'

interface ClWebViewControlProps {
  html: string
  label?: string
  routeToEditor?: Href
  valid?: boolean
  disabled?: boolean
  inputWrapperStyle?: StyleProp<ViewStyle>
}

export function ClWebViewControl(props: ClWebViewControlProps) {
  const {
    html,
    label,
    routeToEditor,
    valid = true,
    disabled,
    inputWrapperStyle,
  } = props
  const styles = useStyles()

  const InputBody = (
    routeToEditor ? ClSpringAnimatedPressable : View
  ) as ElementType<TouchableOpacityProps | ViewProps>
  const placeholder = `<span class="placeholder" style="color:${String(styles.placeholder.color)};">Tap to edit...</span>`

  return (
    <View>
      {label && <ClText style={styles.inputLabel}>{label}</ClText>}
      <InputBody
        style={[
          styles.input,
          !valid && styles.inputInvalid,
          disabled && styles.inputDisabled,
          inputWrapperStyle,
        ]}
        onPress={routeToEditor ? () => router.push(routeToEditor) : undefined}
      >
        <WebView
          originWhitelist={['*']}
          source={{
            html: createHTML({
              preStyles: Styled.RichTextInput.initialCSSText,
              bodyStyles: Styled.RichTextInput.contentCSSText,
              body: html === '' ? placeholder : html,
              backgroundColor: valid
                ? styles.input.backgroundColor
                : styles.inputInvalid.backgroundColor.toString(),
              textColor: styles.input.color,
            }),
          }}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scalesPageToFit={Platform.OS === 'android'}
          height={html !== '' ? Spacing[40] : Spacing[14]}
          containerStyle={[
            styles.webviewContainer,
            !valid && styles.inputInvalid,
            disabled && styles.inputDisabled,
          ]}
          style={[
            styles.webviewContainer,
            !valid && styles.inputInvalid,
            disabled && styles.inputDisabled,
          ]}
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          bounces={false}
          renderLoading={() => <ClSpinner />}
          pointerEvents="none"
        />
      </InputBody>
    </View>
  )
}

const useStyles = createStyles(
  ({ scheme, colors, sizes, styled: { TextInput }, spacing }) => ({
    inputLabel: {
      marginBottom: spacing[2],
      fontSize: TextInput.sizes.small.labelFontSize,
      // lineHeight: TextInput.sizes.small.labelFontSize,
    },
    webviewContainer: {
      padding: TextInput.sizes.small.padding,
      backgroundColor: TextInput.colors[scheme].background,
    },
    input: {
      overflow: 'hidden',
      color: colors.primaryText,
      borderRadius: TextInput.radius,
      backgroundColor: TextInput.colors[scheme].background,
      borderWidth: sizes.borderWidth.thin,
      borderColor: TextInput.colors[scheme].border,
    },
    placeholder: {
      color: resolveColor(colors.neutral[500], colors.neutral[400]),
    },
    inputInvalid: {
      borderColor: resolveColor(
        colors.states.danger[300],
        colors.states.danger[400]
      ),
      backgroundColor: resolveColor(
        colors.states.danger[900],
        colors.states.danger[50]
      ),
    },
    inputDisabled: {
      borderColor: resolveColor(colors.neutral[800], colors.neutral[50]),
    },
  })
)
