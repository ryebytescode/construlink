import { useDpUploader } from '@/hooks/useDpUploader'
import { IconSet } from '@/types/icons'
import { ToastPosition, toast } from '@backpackapp-io/react-native-toast'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useEffect, useRef } from 'react'
import React from 'react'
import { ClSpringAnimatedPressable } from './ClAnimated'
import { ClAvatar } from './ClAvatar'
import { ClBottomSheet } from './ClBottomSheet'
import { ClMenu } from './ClMenu'
import { ClSpinner, type ClSpinnerHandleProps } from './ClSpinner'

export function AvatarUploader() {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  // const {
  //   handleOpenImagePicker,
  //   handleRemoveImage,
  //   profileUrl,
  //   isProcessing,
  //   isSuccess,
  //   isError,
  // } = useDpUploader()

  // useEffect(() => {
  //   if (isProcessing) {
  //     bottomSheetRef.current?.dismiss()
  //     spinnerRef.current?.show()
  //   } else {
  //     spinnerRef.current?.hide()
  //   }
  // }, [isProcessing])

  // useEffect(() => {
  //   if (isSuccess) {
  //     spinnerRef.current?.hide()

  //     toast.success('Profile photo successfully changed.', {
  //       position: ToastPosition.BOTTOM,
  //       duration: 4000,
  //     })
  //   }
  // }, [isSuccess])

  // useEffect(() => {
  //   if (isError) {
  //     spinnerRef.current?.hide()

  //     toast.error('Unable to upload the profile photo.', {
  //       position: ToastPosition.BOTTOM,
  //       duration: 4000,
  //     })
  //   }
  // }, [isError])

  return (
    <>
      <ClSpringAnimatedPressable
        onPress={async () => bottomSheetRef.current?.present()}
      >
        <ClAvatar source={''} />
      </ClSpringAnimatedPressable>
      {/* <ClBottomSheet ref={bottomSheetRef} enableDynamicSizing={true}>
        <ClMenu
          hasBorders={false}
          items={[
            {
              title: 'Take photo',
              icon: {
                set: IconSet.MaterialCommunityIcons,
                name: 'camera',
              },
              onPress: () => handleOpenImagePicker(true),
            },
            {
              title: 'Choose from gallery',
              icon: {
                set: IconSet.MaterialCommunityIcons,
                name: 'image',
              },
              onPress: () => handleOpenImagePicker(false),
            },
            profileUrl
              ? {
                  title: 'Remove',
                  icon: {
                    set: IconSet.MaterialCommunityIcons,
                    name: 'delete',
                  },
                  onPress: handleRemoveImage,
                }
              : null,
          ]}
        />
      </ClBottomSheet> */}
      <ClSpinner ref={spinnerRef} transluscent />
    </>
  )
}
