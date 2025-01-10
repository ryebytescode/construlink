import { ClButton } from '@/components/ClButton'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { SignUpSchema } from '@/lib/schemas'
import { useAuthStore } from '@/stores/auth'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { type MouseEvent, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { type GestureResponderEvent, View } from 'react-native'

const defaultValues: SignUpFields = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  phone: '',
  mode: 'email',
}

export default function EmailPhoneAuthScreen() {
  const [inputMode, setInputMode] = useState<SignUpFields['mode']>(
    defaultValues.mode
  )
  const { control, handleSubmit, reset } = useForm<SignUpFields>({
    defaultValues: {
      ...defaultValues,
      mode: inputMode,
    },
    resolver: zodResolver(SignUpSchema),
  })
  const setAuthMode = useAuthStore((state) => state.setMode)
  const setRole = useAuthStore((state) => state.setRole)
  const isEmailMode = inputMode === 'email'

  const onSubmit: SubmitHandler<SignUpFields> = async (data) => {}

  function handleToggleInputMode() {
    setInputMode((prev) => (prev === 'email' ? 'phone' : 'email'))
    reset()
  }

  function handleGoToSignIn(
    event: MouseEvent<HTMLAnchorElement> | GestureResponderEvent
  ) {
    event.preventDefault()
    setAuthMode('signin')
    setRole(null)
    router.dismissAll()
    router.navigate('/auth/method-chooser')
  }

  return (
    <ClPageView id="signup" title="Create an account" scrollable>
      <ClButton
        icon={
          isEmailMode
            ? { set: IconSet.MaterialCommunityIcons, name: 'cellphone' }
            : { set: IconSet.MaterialCommunityIcons, name: 'email' }
        }
        variant="outline"
        text={`Use ${isEmailMode ? 'phone number' : 'email'}`}
        onPress={handleToggleInputMode}
      />
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
        text="Next"
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
  )
}
