import { ClButton } from '@/components/ClButton'
import { ClIcon } from '@/components/ClIcon'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { Cl } from '@/lib/options'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import * as Linking from 'expo-linking'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import React, { type MouseEvent, useRef } from 'react'
import { type GestureResponderEvent, View } from 'react-native'

export default function EmailPhoneAuthScreen() {
  const { email, forReset } = useLocalSearchParams<{
    email?: string
    forReset?: string
  }>()

  const styles = useStyles()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  function handleGoBack(
    event: MouseEvent<HTMLAnchorElement> | GestureResponderEvent
  ) {
    event.preventDefault()
    router.back()
  }

  async function handleOpenEmailApp() {
    const domain = email!.trim().split('@').pop()!.toLocaleLowerCase()
    const mailAppUrl = Cl.mailAppUrls[domain]
    await Linking.openURL(mailAppUrl ?? `https://${domain}`)
  }

  if (!email) {
    return <Redirect href="/auth/signin" />
  }

  return (
    <>
      <ClPageView id="email-sent" contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>
          <ClIcon
            set={IconSet.MaterialIcon}
            name="mark-email-read"
            color={styles.icon.color}
            size={styles.icon.fontSize}
          />
          <ClText type="h3" weight="bold">
            Check your inbox
          </ClText>
          <ClText dim style={{ textAlign: 'center' }}>
            We sent a {forReset ? 'reset password' : 'verification'} email to{' '}
            <ClText weight="semiBold">{email}</ClText>.
          </ClText>
        </View>
        <ClButton
          text="Open email app"
          onPress={handleOpenEmailApp}
          bodyStyle={{ marginTop: Spacing[4] }}
        />
        <View style={{ flex: 1 }} />
        <ClText type="helper" style={{ textAlign: 'center' }}>
          Haven't received the email? Check your spam folder, or{' '}
          <ClLinkText
            href="/"
            onPress={handleGoBack}
            textProps={{ type: 'helper' }}
          >
            {forReset ? 'try again' : 'resend verification'}
          </ClLinkText>
        </ClText>
      </ClPageView>
      <ClSpinner ref={spinnerRef} transluscent />
    </>
  )
}

const useStyles = createStyles(({ colors, spacing, typo, sizes }) => ({
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
