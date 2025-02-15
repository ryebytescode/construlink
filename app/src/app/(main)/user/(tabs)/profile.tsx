// import { ClMenu } from '@/components/ClMenu'
import { ClPageView } from '@/components/ClPageView'
import { ProfileCard } from '@/components/cards/ProfileCard'
import { useAuth } from '@/contexts/auth'
// import { ProfileCard } from '@/components/cards/ProfileCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { User, UserCollection } from '@/services/firebase'
import { isEmployer } from '@/stores/auth'
import { useQuery } from '@tanstack/react-query'
import { useMount } from 'ahooks'

export default function Profile() {
  useRenderCount('Profile')

  const { userInfo } = useAuth()
  const user = User.get()
  const { data: stats, refetch } = useQuery({
    queryKey: ['stats'],
    queryFn: () => UserCollection.getStats(user!.uid, userInfo!.role),
    enabled: false,
  })

  useMount(() => {
    setTimeout(refetch, 500)
  })

  return (
    <ClPageView id="profile-tab">
      <ProfileCard
        role={userInfo!.role}
        name={user!.displayName ?? '...'}
        designation={isEmployer() ? 'Employer' : 'Tradesperson'}
        stats={stats!}
      />
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
