import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { ForgotPasswordSchema } from '@/lib/schemas'
import { User } from '@/services/firebase'
import { Spacing } from '@/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { useRef } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'

export default function ForgotPasswordScreen() {
  const { control, handleSubmit } = useForm<ForgotPasswordField>({
    defaultValues: { email: '' },
    resolver: zodResolver(ForgotPasswordSchema),
  })
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const onSubmit: SubmitHandler<ForgotPasswordField> = async (data) => {
    spinnerRef.current?.show()

    if (!(await User.sendPasswordResetEmail(data.email))) {
      router.push({
        pathname: '/auth/email-sent',
        params: { email: data.email, forReset: 1 },
      })
    } else {
      spinnerRef.current?.hide()
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
