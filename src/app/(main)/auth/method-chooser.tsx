import { ClButton } from '@/components/ClButton'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { createStyles } from '@/helpers/createStyles'
import { useAuthStore } from '@/stores/auth'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import { router } from 'expo-router'
import type { MouseEvent } from 'react'
import { useForm } from 'react-hook-form'
import { type GestureResponderEvent, View } from 'react-native'

export default function MethodChooserScreen() {
  const styles = useStyles()
  const { control } = useForm<SignUpFields>()
  const authMode = useAuthStore((state) => state.mode)
  const setAuthMode = useAuthStore((state) => state.setMode)

  function handleSwitchMode(
    event: MouseEvent<HTMLAnchorElement> | GestureResponderEvent
  ) {
    event.preventDefault()
    setAuthMode(authMode === 'signup' ? 'signin' : 'signup')
  }

  function handleGoToCredentials() {
    router.push({ pathname: '/auth/email-phone-auth' })
  }

  return (
    <ClPageView
      id="method-chooser"
      title={
        authMode === 'signup' ? 'Create an account' : 'Sign into your account'
      }
      contentContainerStyle={{ flex: 1 }}
    >
      <ClButton
        icon={{
          set: IconSet.AntDesign,
          name: 'google',
        }}
        text="Continue with Google"
      />
      <ClButton
        icon={{
          set: IconSet.Ionicons,
          name: 'logo-facebook',
        }}
        text="Continue with Facebook"
      />
      <ClButton
        icon={{
          set: IconSet.MaterialCommunityIcons,
          name: 'email',
        }}
        text={
          authMode === 'signup' ? 'Sign up with email' : 'Sign in with email'
        }
        onPress={handleGoToCredentials}
      />
      {authMode === 'signup' ? (
        <ClText style={styles.text}>
          Already a member?{' '}
          <ClLinkText href="/" onPress={handleSwitchMode}>
            Sign in
          </ClLinkText>
        </ClText>
      ) : (
        <ClText style={styles.text}>
          Don't have an account?{' '}
          <ClLinkText href="/" onPress={handleSwitchMode}>
            Create one
          </ClLinkText>
        </ClText>
      )}
      <View style={{ flex: 1 }} />
      <ClText type="helper" style={{ textAlign: 'center' }} dim>
        By continuing, you agree to our{' '}
        <ClLinkText href="/" textProps={{ type: 'helper' }}>
          Terms of Service
        </ClLinkText>{' '}
        and{' '}
        <ClLinkText href="/" textProps={{ type: 'helper' }}>
          Privacy Policy
        </ClLinkText>
        .
      </ClText>
    </ClPageView>
  )
}

const useStyles = createStyles(({ colors, spacing, typo }) => ({
  text: {
    textAlign: 'center',
    marginTop: Spacing[4],
  },
}))
