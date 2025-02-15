import { useTheme } from '@/contexts/theme'
import { resolveColor } from '@/helpers/resolveColor'
import { formatDateTime } from '@/helpers/utils'
import { useAppStore } from '@/stores/app'
import { Palette, Sizes, Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import React, {
  type ComponentProps,
  forwardRef,
  useEffect,
  useState,
} from 'react'
import {
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form'
import type { TextInput as RNTextInput } from 'react-native'
import { View } from 'react-native'
import DateTimePicker from 'react-native-date-picker'
import { ClErrorMessage } from './ClErrorMessage'
import { ClIcon } from './ClIcon'
import { ClTextInput } from './ClTextInput'

type TextInputProps = ComponentProps<typeof ClTextInput>

interface ClDateTimePickerProps
  extends Omit<TextInputProps, 'onChange' | 'onChangeText' | 'value'> {
  mode?: 'date' | 'time' | 'datetime'
  onChange?: (date?: Date) => void
}

export const ClDateTimePicker = forwardRef<RNTextInput, ClDateTimePickerProps>(
  (props, ref) => {
    const { mode = 'datetime', onChange, ...rest } = props

    const [value, setValue] = useState<Date>()
    const [pickerVisible, setPickerVisible] = useState(false)
    const { scheme } = useTheme()

    const getTitle = () => {
      let title = ''

      if (mode === 'date') title = 'Select date'
      else if (mode === 'time') title = 'Select time'
      else title = 'Select date & time'

      return title
    }

    const onConfirm = (date: Date) => {
      setPickerVisible(false)
      setValue(date)
    }

    const onCancel = () => {
      setPickerVisible(false)

      if (value) setValue(undefined)
    }

    useEffect(() => {
      if (onChange) onChange(value)
    }, [value])

    return (
      <>
        <ClTextInput
          {...rest}
          ref={ref}
          value={value ? formatDateTime(value) : ''}
          onPress={() => setPickerVisible(true)}
          readOnly
        />
        <DateTimePicker
          modal
          title={getTitle()}
          confirmText="Set"
          open={pickerVisible}
          date={value ?? new Date()}
          minimumDate={new Date()}
          onConfirm={onConfirm}
          onCancel={onCancel}
          buttonColor={
            resolveColor(
              scheme,
              Palette.dark.accent.base,
              Palette.light.brand.base
            ) as string
          }
        />
      </>
    )
  }
)

interface ControlledDateTimePickerProps {
  textInputOptions?: Partial<
    Omit<
      ClDateTimePickerProps,
      'onBlur' | 'onChange' | 'value' | 'valid' | 'disabled'
    >
  >
}

export const ControlledDateTimePicker = <TFields extends FieldValues>({
  textInputOptions,
  ...controllerProps
}: ControlledDateTimePickerProps & UseControllerProps<TFields>) => {
  const { field, fieldState } = useController(controllerProps)
  const { scheme, colors } = useTheme()

  return (
    <View style={{ gap: Spacing[1] }}>
      <ClDateTimePicker
        {...field}
        valid={!fieldState.invalid}
        {...textInputOptions}
      />
      {fieldState.invalid && fieldState.error?.message && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing[1],
          }}
        >
          <ClIcon
            set={IconSet.MaterialCommunityIcons}
            name="error"
            size={Sizes.icon.sm}
            color={resolveColor(
              scheme,
              colors.states.danger[300],
              colors.states.danger[400]
            )}
          />
          <ClErrorMessage message={fieldState.error?.message} />
        </View>
      )}
    </View>
  )
}
