import { ClButton } from '@/components/ClButton'
import { ClIcon } from '@/components/ClIcon'
import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { ApplicationCard } from '@/components/cards/ApplicationCard'
import { useAuth } from '@/contexts/auth'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { JobCollection, User } from '@/services/firebase'
import { IconSet } from '@/types/icons'
import { Timestamp } from '@react-native-firebase/firestore'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

export default function JobApplicationsTab() {
  const styles = useStyles()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  const { userInfo } = useAuth()

  const {
    data: jobApplications,
    refetch,
    isFetching,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: ['applications'],
    queryFn: () => JobCollection.getJobApplications(User.get()!.uid),
  })

  useEffect(() => {
    if (isFetching || isRefetching) {
      spinnerRef.current?.show()
    } else {
      spinnerRef.current?.hide()
    }
  }, [isFetching, isRefetching])

  return (
    <>
      <ClPageView id="job-applications" scrollable={false}>
        <FlatList
          data={jobApplications || []}
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
                  Nothing here
                </ClText>
                <ClText type="helper" dim>
                  You haven't applied for any jobs yet.
                </ClText>
              </View>
              <ClButton
                text="Browse Jobs"
                onPress={() => router.push('/user/jobs')}
              />
            </View>
          }
          renderItem={({ item }) => (
            <ApplicationCard
              applicationId={item.key}
              title={'Masonry'}
              applyTime={new Timestamp(
                item.createdAt.seconds,
                item.createdAt.nanoseconds
              ).toDate()}
              status={item.status}
              employer={'ABC Company'}
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
