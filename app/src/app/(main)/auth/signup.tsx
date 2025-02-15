import { ClButton } from '@/components/ClButton'
import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import type { Role } from '@/lib/constants'
import { SignUpSchema } from '@/lib/schemas'
import { User } from '@/services/firebase'
import { Spacing } from '@/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import { router, useLocalSearchParams } from 'expo-router'
import React, { type MouseEvent, useRef, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Alert, type GestureResponderEvent, View } from 'react-native'

const defaultValues: SignUpFields = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  phone: '',
  mode: 'email',
}

export default function SignUpScreen() {
  const [inputMode, setInputMode] = useState<SignUpFields['mode']>(
    defaultValues.mode
  )
  const { control, handleSubmit } = useForm<SignUpFields>({
    defaultValues: {
      ...defaultValues,
      mode: inputMode,
    },
    resolver: zodResolver(SignUpSchema),
  })
  const { role } = useLocalSearchParams<{ role?: Role }>()
  const isEmailMode = inputMode === 'email'

  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const onSubmit: SubmitHandler<SignUpFields> = async (data) => {
    spinnerRef.current?.show()

    if (await User.signUp(data, role!, isEmailMode)) {
      router.replace(`/auth/email-sent?email=${data.email!}`)
    } else {
      Alert.alert(
        'Sign up failed',
        'An error occurred while creating your account. Please try again.',
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

      spinnerRef.current?.hide()
    }
  }

  // function handleToggleInputMode() {
  //   setInputMode((prev) => (prev === 'email' ? 'phone' : 'email'))
  //   reset()
  // }

  function handleGoToSignIn(
    event: MouseEvent<HTMLAnchorElement> | GestureResponderEvent
  ) {
    event.preventDefault()

    if (router.canDismiss()) router.dismissAll()

    router.navigate({
      pathname: '/auth/method-chooser',
      params: { mode: 'signin' },
    })
  }

  return (
    <>
      <ClPageView id="signup" title="Create an account" scrollable>
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
        <View style={{ flexDirection: 'row', gap: Spacing[4] }}>
          <ControlledTextInput
            control={control}
            name="firstName"
            textInputOptions={{
              label: 'First name',
              placeholder: 'Juan',
            }}
            style={{ flex: 1 }}
          />
          <ControlledTextInput
            control={control}
            name="lastName"
            textInputOptions={{
              label: 'Last name',
              placeholder: 'dela Cruz',
            }}
            style={{ flex: 1 }}
          />
        </View>
        {isEmailMode ? (
          <>
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
            }}
          />
        )}
        <ClButton
          text="Create my account"
          onPress={handleSubmit(onSubmit)}
          bodyStyle={{ marginTop: Spacing[4] }}
        />
        <ClText style={{ textAlign: 'center', marginVertical: Spacing[2] }}>
          Already a member?{' '}
          <ClLinkText href="/" onPress={handleGoToSignIn}>
            Sign in
          </ClLinkText>
        </ClText>
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} transluscent />
    </>
  )
}
