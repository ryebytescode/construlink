import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { ForgotPasswordSchema } from '@/lib/schemas'
import { Spacing } from '@/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import auth from '@react-native-firebase/auth'
import { router } from 'expo-router'
import type { FirebaseError } from 'firebase/app'
import React, { useRef } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'

export default function EmailPhoneAuthScreen() {
  const { control, handleSubmit } = useForm<ForgotPasswordField>({
    defaultValues: { email: '' },
    resolver: zodResolver(ForgotPasswordSchema),
  })

  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const onSubmit: SubmitHandler<ForgotPasswordField> = async (data) => {
    spinnerRef.current?.show()

    try {
      await auth().sendPasswordResetEmail(data.email)
      router.push(`/auth/email-sent?email=${data.email}`)
    } catch (error) {
      const errorCode = (error as FirebaseError).code
      console.log(errorCode)
      Alert.alert(
        'Failed',
        "We couldn't send the instructions to the provided email due to a server error.",
        [
          {
            text: 'Retry',
            isPreferred: true,
          },
        ],
        {
          cancelable: false,
        }
      )
    } finally {
      spinnerRef.current?.hide()
    }
  }

  return (
    <>
      <ClPageView
        id="forgot-password"
        title="Reset password"
        subtitle="Please enter the email address associated with your account. We'll send you instructions to reset your password."
      >
        <ControlledTextInput
          control={control}
          name="email"
          textInputOptions={{
            label: 'Email',
            placeholder: 'juandelacruz@yahoo.com',
            inputMode: 'email',
            autoCapitalize: 'none',
          }}
        />
        <ClButton
          text="Send me the instructions"
          onPress={handleSubmit(onSubmit)}
          bodyStyle={{ marginVertical: Spacing[4] }}
        />
      </ClPageView>
      <ClSpinner ref={spinnerRef} transluscent />
    </>
  )
}
