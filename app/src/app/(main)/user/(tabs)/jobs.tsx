import { ClButton } from '@/components/ClButton'
import { ClIcon } from '@/components/ClIcon'
import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { JobCard } from '@/components/cards/JobCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { JobCollection } from '@/services/firebase'
import { IconSet } from '@/types/icons'
import { Timestamp } from '@react-native-firebase/firestore'
import { useQuery } from '@tanstack/react-query'
import { useMount } from 'ahooks'
import { router } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

export default function Jobs() {
  useRenderCount('Jobs')

  const styles = useStyles()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const {
    data: jobPosts,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: JobCollection.getAllJobPosts,
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
      <ClPageView id="jobs-tab" scrollable={false}>
        <FlatList
          data={jobPosts}
          contentContainerStyle={styles.entries}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View style={styles.emptyPlaceholder}>
              <ClIcon
                set={IconSet.MaterialCommunityIcons}
                name="newspaper-variant-outline"
                color={styles.heroIcon.color}
                size={styles.heroIcon.fontSize}
              />
              <View style={styles.encouragement}>
                <ClText type="lead" style={styles.heroText}>
                  Create a job post now!
                </ClText>
                <ClText type="helper" dim>
                  You can manage your posted jobs here.
                </ClText>
              </View>
              <ClButton
                text="Post a Job"
                onPress={() => router.navigate('/')}
              />
            </View>
          }
          renderItem={({ item }) => (
            <JobCard
              jobId={item.key}
              authorId={item.authorId}
              title={item.title}
              location={item.location}
              postTime={new Timestamp(
                item.createdAt.seconds,
                item.createdAt.nanoseconds
              ).toDate()}
              postAs={item.postAs}
              employmentType={item.employmentType}
              status={item.status}
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
