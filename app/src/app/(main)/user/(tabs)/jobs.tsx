import { ClButton } from '@/components/ClButton'
import { ClIcon } from '@/components/ClIcon'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { JobCard } from '@/components/cards/JobCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { JobCollection } from '@/services/firestore'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import firestore from '@react-native-firebase/firestore'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import React from 'react'
import { Alert, FlatList, RefreshControl, View } from 'react-native'

export default function Jobs() {
  const styles = useStyles()
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useQuery(
    {
      queryKey: ['jobs'],
      queryFn: () => JobCollection.getAllJobPosts(),
    }
  )

  if (isError) {
    Alert.alert('Loading failed', 'Could not retrieve jobs.', [
      {
        text: 'Retry',
        isPreferred: true,
        onPress: () => refetch(),
      },
    ])
  }

  return (
    <>
      <ClPageView id="jobs-tab" scrollable={false}>
        <FlatList
          data={data}
          contentContainerStyle={styles.entries}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
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
              postTime={new firestore.Timestamp(
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
      {(isLoading || isFetching) && <ClSpinner transluscent />}
    </>
  )
}

const useStyles = createStyles(({ colors, spacing, sizes, typo }) => ({
  emptyPlaceholder: {
    alignItems: 'center',
    gap: spacing[6],
    marginTop: spacing[20],
  },
  heroIcon: {
    fontSize: sizes.icon['4xl'],
    color: resolveColor(colors.neutral[700], colors.neutral[300]),
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
