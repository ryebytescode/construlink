import { ClIcon } from '@/components/ClIcon'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { HireRequestCard } from '@/components/cards/HireRequestCard'
import { useAuth } from '@/contexts/auth'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { Role } from '@/lib/constants'
import { HireRequestCollection, User } from '@/services/firebase'
import { IconSet } from '@/types/icons'
import { useQuery } from '@tanstack/react-query'
import { useMount } from 'ahooks'
import React from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

export default function RequestsScreen() {
  const styles = useStyles()
  const { userInfo } = useAuth()
  const {
    data: requests,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['hire-requests'],
    queryFn: () => {
      if (userInfo!.role! === Role.EMPLOYER) {
        return HireRequestCollection.getMyRequests()
      }

      return HireRequestCollection.getRequests(User.get()!.uid)
    },
    enabled: false,
  })

  useMount(() => {
    setTimeout(refetch, 100)
  })

  return (
    <ClPageView id="job-posts" scrollable={false}>
      <FlatList
        data={requests}
        contentContainerStyle={styles.entries}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyPlaceholder}>
            <ClIcon
              set={IconSet.MaterialCommunityIcons}
              name="account-outline"
              color={styles.heroIcon.color}
              size={styles.heroIcon.fontSize}
            />
            <View style={styles.encouragement}>
              <ClText type="lead" style={styles.heroText}>
                No hire requests yet
              </ClText>
              <ClText type="helper" dim>
                {userInfo!.role! === Role.EMPLOYER
                  ? 'Start hiring now.'
                  : 'Start applying for jobs now.'}
              </ClText>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <HireRequestCard
            key={item.key}
            hireRequestId={item.key}
            createdAt={item.createdAt}
            jobType={item.jobType}
            location={item.location}
            status={item.status}
            fullName={
              userInfo!.role! === Role.EMPLOYER
                ? item.tradespersonName
                : item.employerName
            }
            role={userInfo?.role!}
          />
        )}
      />
    </ClPageView>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  emptyPlaceholder: {
    alignItems: 'center',
    gap: spacing[6],
    marginTop: spacing[20],
  },
  heroIcon: {
    fontSize: sizes.icon['4xl'],
    color: resolveColor(scheme, colors.neutral[700], colors.neutral[300]),
  },
  encouragement: {
    alignItems: 'center',
    gap: spacing[2],
  },
  heroText: typo.fontMap.semiBold,
  entries: {
    gap: spacing[3],
    paddingBottom: spacing[20],
  },
}))
