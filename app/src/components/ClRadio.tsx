import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import type { Styled } from '@/theme'
import { useState } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { ClSpringAnimatedPressable } from './ClAnimated'
import { ClText } from './ClText'

export interface RadioOption {
  label: string
  value: string | number
}

interface ClRadioInputProps {
  id: string
  label?: string
  value?: RadioOption['value']
  defaultValue?: RadioOption['value']
  options: RadioOption[]
  onChange?: (value: RadioOption['value']) => void
  contentContainerStyle?: StyleProp<ViewStyle>
  radioInputStyles?: StyleProp<ViewStyle>
  size?: keyof typeof Styled.TextInput.sizes
}

export function ClRadioInput({
  id,
  label,
  value,
  defaultValue,
  options,
  onChange,
  size = 'medium',
  contentContainerStyle,
  radioInputStyles,
}: ClRadioInputProps) {
  useRenderCount(`ClRadioInput: ${id}`)

  const styles = useStyles({ size })
  const [selected, setSelected] = useState(defaultValue ?? '')

  function handleSelect(selectedValue: RadioOption['value']) {
    // controlled
    if (onChange) {
      onChange(selectedValue)
    } else {
      setSelected(selectedValue)
    }
  }

  function isSelected(selectedValue: RadioOption['value']) {
    if (selectedValue === selected) return true

    if (onChange && selectedValue === value) {
      return true
    }

    return false
  }

  return (
    <View>
      {label && <ClText style={styles.inputLabel}>{label}</ClText>}
      <View style={[styles.container, contentContainerStyle]}>
        {options.map((option) => (
          <ClSpringAnimatedPressable
            key={option.value}
            style={[
              styles.option,
              radioInputStyles,
              isSelected(option.value) && styles.optionSelected,
            ]}
            onPress={() => handleSelect(option.value)}
          >
            <View style={styles.optionLeft}>
              <View style={styles.radioButtonWrapper}>
                <View
                  style={[
                    styles.radioButtonIndicator,
                    isSelected(option.value) &&
                      styles.radioButtonIndicatorSelected,
                  ]}
                />
              </View>
            </View>
            <View style={styles.optionRight}>
              <ClText weight="semiBold" style={styles.optionLabel}>
                {option.label}
              </ClText>
            </View>
          </ClSpringAnimatedPressable>
        ))}
      </View>
    </View>
  )
}

const useStyles = createStyles(
  (
    { scheme, colors, spacing, sizes, typo, styled: { TextInput } },
    { size = 'medium' }: Pick<ClRadioInputProps, 'size'>
  ) => ({
    container: {
      gap: spacing[2],
    },
    inputLabel: {
      marginBottom: spacing[2],
      fontSize: TextInput.sizes[size].labelFontSize,
      // lineHeight: TextInput.sizes[size].labelFontSize,
    },
    option: {
      gap: spacing[4],
      flexDirection: 'row',
      backgroundColor: 'transparent',
      padding: TextInput.sizes[size].padding,
      borderRadius: sizes.radius['2xl'],
      borderWidth: sizes.borderWidth.thin,
      borderColor: resolveColor(
        scheme,
        colors.neutral[700],
        colors.neutral[200]
      ),
    },
    optionSelected: {
      backgroundColor: resolveColor(
        scheme,
        colors.neutral[700],
        colors.neutral[100]
      ),
    },
    optionLeft: {
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      flexGrow: 0,
    },
    optionRight: {
      flexShrink: 1,
    },
    optionLabel: {
      fontSize: TextInput.sizes[size].fontSize,
    },
    radioButtonWrapper: {
      justifyContent: 'center',
      width: sizes.icon.md,
      height: sizes.icon.md,
      borderRadius: sizes.radius.full,
      backgroundColor: resolveColor(
        scheme,
        colors.neutral[700],
        colors.neutral[50]
      ),
      borderWidth: sizes.borderWidth.thin,
      borderColor: resolveColor(
        scheme,
        colors.neutral[600],
        colors.neutral[300]
      ),
    },
    radioButtonIndicator: {
      width: sizes.icon.sm,
      height: sizes.icon.sm,
      alignSelf: 'center',
    },
    radioButtonIndicatorSelected: {
      backgroundColor: resolveColor(
        scheme,
        colors.accent[500],
        colors.brand.base
      ),
      borderRadius: sizes.radius.full,
    },
  })
)
