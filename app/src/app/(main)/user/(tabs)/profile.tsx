import { ClCard } from '@/components/ClCard'
import { ClIconText } from '@/components/ClIconText'
import {
  ClInlineSpinner,
  type ClSpinnerHandleProps,
} from '@/components/ClInlineSpinner'
import { ClMenu } from '@/components/ClMenu'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { ProfileCard } from '@/components/cards/ProfileCard'
import { useAuth } from '@/contexts/auth'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { User } from '@/services/firebase'
import { Typo } from '@/theme'
import { IconSet } from '@/types/icons'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'

export default function Profile() {
  useRenderCount('Profile')

  const { userInfo, isFetchingUserInfo } = useAuth()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  useEffect(() => {
    if (isFetchingUserInfo) {
      spinnerRef.current?.show()
    } else {
      spinnerRef.current?.hide()
    }
  }, [isFetchingUserInfo])

  return (
    <>
      <ClPageView id="profile-tab">
        {userInfo && (
          <>
            <ProfileCard userId={User.get()?.uid!} details={userInfo} self />
            <ClCard
              header={
                <ClText style={{ ...Typo.fontMap.semiBold }}>About</ClText>
              }
            >
              {userInfo.bio && (
                <ClIconText
                  text={userInfo.bio}
                  icon={{
                    set: IconSet.MaterialCommunityIcons,
                    name: 'comment-quote',
                  }}
                />
              )}
              <ClIconText
                text={userInfo.location}
                icon={{
                  set: IconSet.MaterialCommunityIcons,
                  name: 'map-marker',
                }}
              />
              {!userInfo.emailHidden && (
                <ClIconText
                  text={userInfo.email}
                  icon={{ set: IconSet.MaterialCommunityIcons, name: 'email' }}
                />
              )}
            </ClCard>
            <ClMenu
              items={[
                {
                  title: 'Hires',
                  icon: {
                    set: IconSet.MaterialCommunityIcons,
                    name: 'account-check',
                  },
                  onPress: () => router.push('/user/requests'),
                },
                {
                  title: 'Posts',
                  icon: {
                    set: IconSet.MaterialCommunityIcons,
                    name: 'newspaper-variant',
                  },
                },
                {
                  title: 'Saved',
                  icon: {
                    set: IconSet.MaterialCommunityIcons,
                    name: 'bookmark',
                  },
                  onPress: () => router.push('/user/saved'),
                },
              ]}
            />
          </>
        )}
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} visible />
    </>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  overview: {
    overflow: 'hidden',
    backgroundColor: resolveColor(
      scheme,
      colors.neutral[800],
      colors.neutral[100]
    ),
    borderRadius: sizes.radius['2xl'],
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(scheme, colors.neutral[700], colors.neutral[200]),
  },
  overviewItem: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: sizes.borderWidth.thin,
    borderTopColor: resolveColor(
      scheme,
      colors.neutral[700],
      colors.neutral[200]
    ),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewLeft: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  overviewIcon: {
    color: resolveColor(scheme, colors.neutral[100], colors.neutral[100]),
    fontSize: typo.sizes['2xl'].fontSize,
  },
}))
