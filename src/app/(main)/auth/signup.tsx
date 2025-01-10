import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { SignUpSchema } from '@/lib/schemas'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { View } from 'react-native'

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
  const isEmailMode = inputMode === 'email'

  const onSubmit: SubmitHandler<SignUpFields> = async (data) => {}

  function handleToggleInputMode() {
    setInputMode((prev) => (prev === 'email' ? 'phone' : 'email'))
    reset()
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
    </ClPageView>
  )
}
