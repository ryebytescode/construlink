// import { ClMenu } from '@/components/ClMenu'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
// import { ProfileCard } from '@/components/cards/ProfileCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { isEmployer, useAuthStore } from '@/stores/auth'
import { IconSet } from '@/types/icons'
import { router } from 'expo-router'

export default function Profile() {
  useRenderCount('Profile')

  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.role)

  return (
    <ClPageView id="profile-tab" title="Profile">
      {/* <ProfileCard
        role={role!}
        name={user?.displayName}
        designation={isEmployer() ? 'Employer' : 'Tradesperson'}
        // stats={stats!}
      /> */}
      {/* Overview */}
      {/* <ClMenu
        items={[
          {
            title: 'Job Posts',
            icon: {
              set: IconSet.MaterialCommunityIcons,
              name: 'briefcase-variant-outline',
            },
            right: <ClText dim>{stats?.posts ?? '...'}</ClText>,
            onPress: () => router.push('/(tabs)/jobs')
          },
          {
            title: 'People Hired',
            icon: {
              set: IconSet.Ionicons,
              name: 'hammer-outline',
            },
            right: <ClText dim>102</ClText>,
          },
        ]}
      /> */}
    </ClPageView>
  )
}

const useStyles = createStyles(({ colors, spacing, sizes, typo }) => ({
  overview: {
    overflow: 'hidden',
    backgroundColor: resolveColor(colors.neutral[800], colors.neutral[100]),
    borderRadius: sizes.radius['2xl'],
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(colors.neutral[700], colors.neutral[200]),
  },
  overviewItem: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: sizes.borderWidth.thin,
    borderTopColor: resolveColor(colors.neutral[700], colors.neutral[200]),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewLeft: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  overviewIcon: {
    color: resolveColor(colors.neutral[100], colors.neutral[100]),
    fontSize: typo.sizes['2xl'].fontSize,
  },
}))
