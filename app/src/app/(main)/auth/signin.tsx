import { ClButton } from '@/components/ClButton'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { SignInSchema } from '@/lib/schemas'
import { useAuthStore } from '@/stores/auth'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import auth from '@react-native-firebase/auth'
import { router } from 'expo-router'
import type { FirebaseError } from 'firebase/app'
import React, { type MouseEvent, useEffect, useRef, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Alert, type GestureResponderEvent, View } from 'react-native'

const defaultValues: SignInFields = {
  email: '',
  password: '',
  phone: '',
  mode: 'email',
}

export default function SignInScreen() {
  const [inputMode, setInputMode] = useState<SignInFields['mode']>(
    defaultValues.mode
  )
  const { control, handleSubmit, reset, setValue } = useForm<SignInFields>({
    defaultValues,
    resolver: zodResolver(SignInSchema),
  })
  const setAuthMode = useAuthStore((state) => state.setMode)
  const setRole = useAuthStore((state) => state.setRole)
  const isEmailMode = inputMode === 'email'

  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const onSubmit: SubmitHandler<SignInFields> = async (data) => {
    spinnerRef.current?.show()

    try {
      if (isEmailMode) {
        await auth().signInWithEmailAndPassword(data.email!, data.password!)
      } else {
        const phone = `'+63${data.phone!.slice(1, data.phone!.length)}`
        await auth().signInWithPhoneNumber(phone, true)
      }
    } catch (error) {
      const errorCode = (error as FirebaseError).code
      if (errorCode === 'auth/invalid-credential') {
        Alert.alert(
          'Sign in Failed',
          'Incorrect email or password. Please try again or reset your password.',
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
    } finally {
      spinnerRef.current?.hide()
    }
  }

  function handleToggleInputMode() {
    setInputMode((prev) => (prev === 'email' ? 'phone' : 'email'))
    reset()
  }

  function handleGoToSignUp(
    event: MouseEvent<HTMLAnchorElement> | GestureResponderEvent
  ) {
    event.preventDefault()
    setAuthMode('signup')
    setRole(null)

    if (router.canDismiss()) router.dismissAll()
    router.navigate('/auth/role-selection')
  }

  useEffect(() => {
    setValue('mode', inputMode)
  }, [inputMode])

  return (
    <>
      <ClPageView
        id="signin"
        title="Sign in"
        contentContainerStyle={{ flex: 1 }}
      >
        {/* <ClButton
        icon={
          isEmailMode
            ? { set: IconSet.MaterialCommunityIcons, name: 'cellphone' }
            : { set: IconSet.MaterialCommunityIcons, name: 'email' }
        }
        variant="outline"
        text={`Use ${isEmailMode ? 'phone number' : 'email'}`}
        onPress={handleToggleInputMode}
      /> */}
        {isEmailMode ? (
          <>
            <ControlledTextInput
              control={control}
              name="email"
              textInputOptions={{
                label: 'Email',
                placeholder: 'juandelacruz@yahoo.com',
                inputMode: 'email',
              }}
            />
            <ControlledTextInput
              control={control}
              name="password"
              textInputOptions={{
                label: 'Password',
                placeholder: '********',
                secureTextEntry: true,
                passwordMode: true,
                autoCapitalize: 'none',
                autoComplete: 'off',
                autoCorrect: false,
              }}
            />
          </>
        ) : (
          <ControlledTextInput
            control={control}
            name="phone"
            textInputOptions={{
              label: 'Phone',
              placeholder: '0912 345 6789',
              inputMode: 'numeric',
              maxLength: 11,
            }}
          />
        )}
        <ClButton
          text={isEmailMode ? 'Sign in' : 'Send OTP'}
          onPress={handleSubmit(onSubmit)}
          bodyStyle={{ marginVertical: Spacing[4] }}
        />
        <View style={{ alignItems: 'center' }}>
          <ClLinkText href="/auth/forgot-password">Forgot password?</ClLinkText>
        </View>
        <View style={{ flex: 1 }} />
        <ClText style={{ textAlign: 'center' }}>
          Don't have an account?{' '}
          <ClLinkText href="/" onPress={handleGoToSignUp}>
            Create one
          </ClLinkText>
        </ClText>
      </ClPageView>
      <ClSpinner ref={spinnerRef} transluscent />
    </>
  )
}
