import { ClButton } from '@/components/ClButton'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { createStyles } from '@/helpers/createStyles'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import { router } from 'expo-router'
import { View } from 'react-native'

export default function MethodChooserScreen() {
  function handleGoToCredentials() {
    router.push({ pathname: '/auth/signup' })
  }

  return (
    <ClPageView
      id="method-chooser"
      title="Choose your authentication method"
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
        text="Continue with email"
        onPress={handleGoToCredentials}
      />
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
