import { ClIcon } from '@/components/ClIcon'
import {
  ClInlineSpinner,
  type ClSpinnerHandleProps,
} from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { SavedProfileCard } from '@/components/cards/SavedProfileCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { SavedProfileCollection } from '@/services/firebase'
import { IconSet } from '@/types/icons'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

export default function ViewSavedScreen() {
  const styles = useStyles()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const {
    data: savedProfiles,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: ['saved-profiles'],
    queryFn: SavedProfileCollection.getSavedProfiles,
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
      <ClPageView id="view-saved" scrollable={false}>
        <FlatList
          data={savedProfiles}
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
                  No saved profiles yet
                </ClText>
                <ClText type="helper" dim>
                  You can save profiles to view them later.
                </ClText>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <SavedProfileCard
              key={item.key}
              tradespersonName={item.tradespersonName}
              profileId={item.profileId}
              savedAt={item.savedAt}
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
