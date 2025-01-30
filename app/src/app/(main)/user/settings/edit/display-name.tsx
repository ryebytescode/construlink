import { ClButton } from '@/components/ClButton'
import {
  ClInlineSpinner,
  type ClSpinnerHandleProps,
} from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { ChangeDisplayNameSchema } from '@/lib/schemas'
import { User } from '@/services/firebase'
import { Spacing } from '@/theme'
import { ToastPosition, toast } from '@backpackapp-io/react-native-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { useRef } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

export default function DisplayNameEditor() {
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  const displayName = User.getDisplayName()
  const { control, handleSubmit } = useForm<ChangeDisplayNameFields>({
    defaultValues: displayName as ChangeDisplayNameFields,
    resolver: zodResolver(ChangeDisplayNameSchema),
  })

  const onSubmit: SubmitHandler<ChangeDisplayNameFields> = async (fields) => {
    spinnerRef.current?.show()

    const isChanged = await User.editDisplayName(fields)

    if (isChanged) {
      toast.success('Display name updated', {
        position: ToastPosition.BOTTOM,
        duration: 4000,
      })

      router.back()
    } else {
      toast.error('Failed to update display name', {
        position: ToastPosition.BOTTOM,
        duration: 4000,
      })
      spinnerRef.current?.hide()
    }
  }

  return (
    <>
      <ClPageView id="display-name-editor">
        <ControlledTextInput
          control={control}
          name="firstName"
          textInputOptions={{
            label: 'First name',
            placeholder: 'Juan',
          }}
        />
        <ControlledTextInput
          control={control}
          name="lastName"
          textInputOptions={{
            label: 'Last name',
            placeholder: 'dela Cruz',
          }}
        />
        <ClButton
          text="Save"
          onPress={handleSubmit(onSubmit)}
          bodyStyle={{ marginTop: Spacing[4] }}
        />
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} transluscent />
    </>
  )
}
