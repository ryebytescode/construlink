import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import auth from '@react-native-firebase/auth'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import type { FirebaseError } from 'firebase/app'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, View } from 'react-native'

export default function VerificationScreen() {
  const styles = useStyles()
  const { code } = useLocalSearchParams<{ code?: string }>()
  const currentUser = auth().currentUser
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    async function checkCode() {
      try {
        await auth().applyActionCode(code!)

        if (router.canDismiss()) router.dismissAll()
        router.replace('/auth/verification-done')
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
          currentUser
            ? {
                text: 'Resend verification',
                isPreferred: true,
                onPress: async () => {
                  setIsResending(true)
                  await currentUser?.sendEmailVerification()
                  router.replace(`/auth/email-sent?email=${currentUser?.email}`)
                },
              }
            : {},
          {
            text: "I'll verify later",
            onPress: () => {
              if (currentUser) {
                router.replace('/user/home')
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
          Just wait a sec...
        </ClText>
        <ClText dim style={{ textAlign: 'center' }}>
          {isResending
            ? 'Resending a new verification email'
            : "We're verifying your email address"}
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
    color: resolveColor(colors.accent[500], colors.brand[500]),
    fontSize: sizes.icon['3xl'],
  },
}))
