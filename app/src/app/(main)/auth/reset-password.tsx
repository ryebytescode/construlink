import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { ResetPasswordSchema } from '@/lib/schemas'
import { Spacing } from '@/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import auth from '@react-native-firebase/auth'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import type { FirebaseError } from 'firebase/app'
import React, { useEffect, useRef } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'

export default function ResetPasswordScreen() {
  const { control, handleSubmit } = useForm<ResetPasswordFields>({
    defaultValues: { confirmPassword: '', newPassword: '' },
    resolver: zodResolver(ResetPasswordSchema),
  })
  const { code } = useLocalSearchParams<{ code?: string }>()

  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const onSubmit: SubmitHandler<ResetPasswordFields> = async (data) => {
    spinnerRef.current?.show()

    try {
      await auth().confirmPasswordReset(code!, data.confirmPassword)
      router.dismissAll()
      router.replace('/auth/reset-done')
    } catch (error) {
      const errorCode = (error as FirebaseError).code
      console.log(errorCode)
      Alert.alert(
        'Password reset failed',
        "We couldn't reset your password due to a server error.",
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

  useEffect(() => {
    async function checkCode() {
      const email = await auth().verifyPasswordResetCode(code!)

      if (!email) {
        router.replace('/auth/signin')
      }
    }

    if (code) checkCode()
  }, [code])

  if (!code) {
    return <Redirect href="/auth/signin" />
  }

  return (
    <>
      <ClPageView
        id="reset-password"
        title="Create a new password"
        subtitle="Your new password must be different from previously used passwords."
      >
        <ControlledTextInput
          control={control}
          name="newPassword"
          textInputOptions={{
            label: 'New password',
            placeholder: '********',
            secureTextEntry: true,
            passwordMode: true,
            autoCapitalize: 'none',
            autoComplete: 'off',
            autoCorrect: false,
          }}
        />
        <ControlledTextInput
          control={control}
          name="confirmPassword"
          textInputOptions={{
            label: 'Confirm password',
            placeholder: '********',
            secureTextEntry: true,
            passwordMode: true,
            autoCapitalize: 'none',
            autoComplete: 'off',
            autoCorrect: false,
          }}
        />
        <ClButton
          text="Reset password"
          onPress={handleSubmit(onSubmit)}
          bodyStyle={{ marginVertical: Spacing[4] }}
        />
      </ClPageView>
      <ClSpinner ref={spinnerRef} transluscent />
    </>
  )
}
