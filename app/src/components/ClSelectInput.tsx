import { IconSet } from '@/types/icons'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, {
  forwardRef,
  type RefObject,
  useCallback,
  useRef,
  useState,
} from 'react'
import type { TextInput } from 'react-native'
import { ClBottomSheet } from './ClBottomSheet'
import { ClIcon } from './ClIcon'
import { ClRadioInput, type RadioOption } from './ClRadio'
import { ClText } from './ClText'
import { ClTextInput, type ClTextInputProps } from './ClTextInput'

export interface SelectInputOption {
  label: string
  value: string | number
  selected?: boolean
}

interface ClSelectInputProps extends Partial<Omit<ClTextInputProps, 'value'>> {
  value?: SelectInputOption['value']
  sheetTitle?: string
  multiple?: boolean
  options: SelectInputOption[]
  isLoading?: boolean
  customBottomSheetRef?: RefObject<BottomSheetModal>
}

export const ClSelectInput = forwardRef<TextInput, ClSelectInputProps>(
  (props, ref) => {
    const {
      sheetTitle,
      options,
      value,
      onChangeText,
      isLoading = false,
      customBottomSheetRef,
      ...rest
    } = props
    const bottomSheetRef = useRef<BottomSheetModal>(null)
    const [_value, setValue] = useState(value)

    const handleOnPress = useCallback(() => {
      if (customBottomSheetRef) {
        customBottomSheetRef.current?.present()
      } else {
        bottomSheetRef.current?.present()
      }
    }, [])

    const handleOnSelect = useCallback(
      (value: RadioOption['value']) => {
        setValue(value)
        bottomSheetRef.current?.dismiss()

        if (onChangeText) onChangeText(value.toString())
      },
      [onChangeText]
    )

    return (
      <>
        <ClTextInput
          ref={ref}
          {...rest}
          readOnly
          value={
            options
              .find((option) => option.value === _value)
              ?.label.toString() ?? ''
          }
          onPress={handleOnPress}
          right={
            <ClIcon set={IconSet.MaterialCommunityIcons} name="chevron-right" />
          }
        />
        {!customBottomSheetRef && (
          <ClBottomSheet
            ref={bottomSheetRef}
            title={sheetTitle ?? 'Select'}
            scrollable
            // snapPoints={['70%']}
            contentContainerStyle={{
              paddingHorizontal: 0,
            }}
            enableDynamicSizing={true}
          >
            {isLoading ? (
              <ClText>Loading...</ClText>
            ) : (
              <ClRadioInput
                id=""
                value={_value}
                size="small"
                options={options}
                contentContainerStyle={{
                  padding: 0,
                }}
                onChange={handleOnSelect}
              />
            )}
          </ClBottomSheet>
        )}
      </>
    )
  }
)
