import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import auth from '@react-native-firebase/auth'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import type { FirebaseError } from 'firebase/app'
import React, { useEffect } from 'react'
import { ActivityIndicator, Alert, View } from 'react-native'

export default function VerificationScreen() {
  const styles = useStyles()
  const { code } = useLocalSearchParams<{ code?: string }>()
  const currentUser = auth().currentUser

  useEffect(() => {
    async function checkCode() {
      try {
        await auth().checkActionCode(code!)
      } catch (error) {
        const errorCode = (error as FirebaseError).code
        let message = ''

        if (
          errorCode === 'auth/expired-action-code' ||
          errorCode === 'auth/invalid-action-code'
        ) {
          message = 'The verification link is invalid or expired.'
        } else {
          message =
            "We couldn't verify your email address due to a server error."
        }

        Alert.alert('Verification failed', message, [
          {
            text: 'Resend verificaion',
            isPreferred: true,
            onPress: async () => {
              await currentUser?.sendEmailVerification()
            },
          },
          {
            text: "I'll verify later",
            onPress: () => {
              if (currentUser) {
                router.replace('/user/dashboard-test')
              } else {
                router.replace('/')
              }
            },
          },
        ])
      }
    }

    checkCode()
  }, [code])

  if (!code) {
    return <Redirect href="/" />
  }

  return (
    <ClPageView id="verification" contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        <ActivityIndicator
          color={styles.icon.color}
          size={styles.icon.fontSize}
        />
        <ClText type="h3" weight="bold">
          Success!
        </ClText>
        <ClText dim style={{ textAlign: 'center' }}>
          Verifying your email address...
        </ClText>
      </View>
    </ClPageView>
  )
}

const useStyles = createStyles(({ colors, spacing, sizes }) => ({
  container: {
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[20],
  },
  icon: {
    color: resolveColor(colors.states.success.base, colors.states.success[600]),
    fontSize: sizes.icon['3xl'],
  },
}))
