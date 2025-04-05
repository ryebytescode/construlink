import { ClButton } from '@/components/ClButton'
import { ClIcon } from '@/components/ClIcon'
import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { HireRequestCard } from '@/components/cards/HireRequestCard'
import { JobCard } from '@/components/cards/JobCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { HireRequestCollection, JobCollection } from '@/services/firebase'
import { IconSet } from '@/types/icons'
import { Timestamp } from '@react-native-firebase/firestore'
import { useQuery } from '@tanstack/react-query'
import { useMount } from 'ahooks'
import React, { useEffect, useRef } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

export default function RequestsScreen() {
  const styles = useStyles()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const {
    data: requests,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: ['hire-requests'],
    queryFn: HireRequestCollection.getMyRequests,
    enabled: false,
  })

  useEffect(() => {
    if (isFetching || isRefetching) {
      spinnerRef.current?.show()
    } else {
      spinnerRef.current?.hide()
    }
  }, [isFetching, isRefetching])

  useMount(() => {
    setTimeout(refetch, 500)
  })

  return (
    <>
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
                  Start hiring now.
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
              tradespersonName={item.tradespersonName}
            />
          )}
        />
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} transluscent />
    </>
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
