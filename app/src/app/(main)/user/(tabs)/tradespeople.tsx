import { ClIcon } from '@/components/ClIcon'
import {
  ClInlineSpinner,
  type ClSpinnerHandleProps,
} from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { TradespersonCard } from '@/components/cards/TradespersonCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { UserCollection } from '@/services/firebase'
import { IconSet } from '@/types/icons'
import { useQuery } from '@tanstack/react-query'
import { useMount } from 'ahooks'
import { useEffect, useRef } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

export default function TradespeopleTab() {
  useRenderCount('Tradespeople')

  const styles = useStyles()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const {
    data: users,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: ['users'],
    queryFn: UserCollection.getTradespeople,
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
      <ClPageView
        id="tradespeople-tab"
        scrollable={false}
        contentContainerStyle={{ flex: 1 }}
      >
        <FlatList
          data={users}
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
                  Nothing to see here.
                </ClText>
                <ClText type="helper" dim>
                  Check back later for new job postings.
                </ClText>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <TradespersonCard
              tradespersonId={item.key}
              firstName={item.firstName}
              lastName={item.lastName}
              location={item.location}
              expertise={item.expertise}
              verified={item.verified}
              rating={item.rating}
              reviews={item.reviews}
              schedule={item.schedule}
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
