import ClLogo from '@/assets/images/logo'
import { ClButton } from '@/components/ClButton'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useAuthStore } from '@/stores/auth'
import { Spacing } from '@/theme'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { type MouseEvent } from 'react'
import { type GestureResponderEvent, View } from 'react-native'

export default function GettingStartedScreen() {
  const styles = useStyles()
  const setAuthMode = useAuthStore((state) => state.setMode)
  const isAuth = useAuthStore((state) => state.user)

  function handleGetStarted() {
    setAuthMode('signup')
    router.push('/auth/role-selection')
  }

  function handleGoToSignIn(
    event: MouseEvent<HTMLAnchorElement> | GestureResponderEvent
  ) {
    event.preventDefault()

    setAuthMode('signin')
    router.push('/auth/method-chooser')
  }

  if (isAuth) return null

  return (
    <>
      <Image
        style={styles.backgroundImage}
        contentFit="cover"
        source={require('@/assets/images/get-started.jpg')}
        transition={1000}
      />
      <ClPageView id="getting-started" contentContainerStyle={styles.container}>
        <View style={styles.greeting}>
          <ClLogo width={200} height={200} style={{ alignSelf: 'center' }} />
          <View style={styles.heroTextContainer}>
            <ClText weight="bold" type="h2" style={{ textAlign: 'center' }}>
              Welcome to Construlink
            </ClText>
            <ClText>Connecting Hands to Projects</ClText>
          </View>
        </View>
        <View style={{ gap: Spacing[4] }}>
          <ClButton
            text="Get Started"
            size="large"
            onPress={handleGetStarted}
          />
          <ClText style={{ textAlign: 'center', marginVertical: Spacing[2] }}>
            Already a member?{' '}
            <ClLinkText href="/" onPress={handleGoToSignIn}>
              Sign in
            </ClLinkText>
          </ClText>
        </View>
      </ClPageView>
    </>
  )
}

const useStyles = createStyles(({ colors, spacing, typo }) => ({
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  container: {
    flex: 1,
    paddingTop: spacing[40],
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: resolveColor(colors.modalBackground, '#ffffffd9'),
  },
  greeting: {
    gap: spacing[4],
  },
  heroTextContainer: {
    alignItems: 'center',
    gap: spacing[2.5],
  },
}))
