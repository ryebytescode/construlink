import { ClButton } from '@/components/ClButton'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { SignUpSchema } from '@/lib/schemas'
import { UserCollection } from '@/services/firestore'
import { useAuthStore } from '@/stores/auth'
import { Spacing } from '@/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import auth from '@react-native-firebase/auth'
import { router } from 'expo-router'
import type { FirebaseError } from 'firebase/app'
import React, { type MouseEvent, useRef, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Alert, type GestureResponderEvent, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

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
  const { control, handleSubmit, reset } = useForm<SignUpFields>({
    defaultValues: {
      ...defaultValues,
      mode: inputMode,
    },
    resolver: zodResolver(SignUpSchema),
  })
  const { setAuthMode, setRole, role } = useAuthStore(
    useShallow((state) => ({
      setAuthMode: state.setMode,
      setRole: state.setRole,
      role: state.role,
    }))
  )
  const isEmailMode = inputMode === 'email'

  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const onSubmit: SubmitHandler<SignUpFields> = async (data) => {
    spinnerRef.current?.show()

    try {
      if (isEmailMode) {
        const { user } = await auth().createUserWithEmailAndPassword(
          data.email!,
          data.password!
        )

        await user.updateProfile({
          displayName: `${data.firstName} ${data.lastName}`,
        })

        UserCollection.setRole(user.uid, role!)

        await auth().currentUser?.sendEmailVerification()
        router.replace(`/auth/email-sent?email=${data.email!}`)
      }
    } catch (error) {
      const errorCode = (error as FirebaseError).code
      let message = ''

      if (errorCode === 'auth/email-already-in-use') {
        message = 'The email you entered is already associated with an account.'
      } else {
        message = "We couldn't create your account due to a server error."
      }

      Alert.alert(
        'Sign up failed',
        message,
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

      if (__DEV__) console.log(errorCode)

      spinnerRef.current?.hide()
    }
  }

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

    if (router.canDismiss()) router.dismissAll()
    router.navigate('/auth/method-chooser')
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
      <ClSpinner ref={spinnerRef} transluscent />
    </>
  )
}
