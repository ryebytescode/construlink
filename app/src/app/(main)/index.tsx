import ClLogo from '@/assets/images/logo'
import { ClButton } from '@/components/ClButton'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { useAuth } from '@/contexts/auth'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { Role } from '@/lib/constants'
import { Spacing } from '@/theme'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

export default function GettingStartedScreen() {
  const styles = useStyles()

  const { initializing, userInfo } = useAuth()

  useEffect(() => {
    if (userInfo) {
      router.replace(
        userInfo.role === Role.EMPLOYER ? '/user/tradespeople' : '/user/jobs'
      )
    }
  }, [userInfo])

  if (initializing || userInfo) {
    return <ClSpinner visible />
  }

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
            onPress={() =>
              router.push({
                pathname: '/auth/role-selection',
                params: { mode: 'signup' },
              })
            }
          />
          <ClText style={{ textAlign: 'center', marginVertical: Spacing[2] }}>
            Already a member?{' '}
            <ClLinkText
              href="/"
              onPress={(event) => {
                event.preventDefault()
                router.push({
                  pathname: '/auth/method-chooser',
                  params: { mode: 'signin' },
                })
              }}
            >
              Sign in
            </ClLinkText>
          </ClText>
        </View>
      </ClPageView>
    </>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, typo }) => ({
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
    backgroundColor: resolveColor(scheme, colors.modalBackground, '#ffffffd9'),
  },
  greeting: {
    gap: spacing[4],
  },
  heroTextContainer: {
    alignItems: 'center',
    gap: spacing[2.5],
  },
}))
