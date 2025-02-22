import { ClButton } from '@/components/ClButton'
import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { SignInSchema } from '@/lib/schemas'
import { User } from '@/services/firebase'
import { Spacing } from '@/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
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
  const isEmailMode = inputMode === 'email'

  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const onSubmit: SubmitHandler<SignInFields> = async (data) => {
    spinnerRef.current?.show()

    if (!(await User.signIn(data, isEmailMode))) {
      spinnerRef.current?.hide()

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
  }

  // function handleToggleInputMode() {
  //   setInputMode((prev) => (prev === 'email' ? 'phone' : 'email'))
  //   reset()
  // }

  function handleGoToSignUp(
    event: MouseEvent<HTMLAnchorElement> | GestureResponderEvent
  ) {
    event.preventDefault()

    if (router.canDismiss()) router.dismissAll()

    router.navigate({
      pathname: '/auth/role-selection',
      params: { mode: 'signup' },
    })
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
      <ClInlineSpinner ref={spinnerRef} transluscent />
    </>
  )
}
