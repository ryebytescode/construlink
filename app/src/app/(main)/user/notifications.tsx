import { ClIcon } from '@/components/ClIcon'
import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { NotificationCard } from '@/components/cards/NotificationCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { NotificationCollection } from '@/services/firebase'
import { IconSet } from '@/types/icons'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

export default function Notifications() {
  const styles = useStyles()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const {
    data: requests,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: ['notifs'],
    queryFn: NotificationCollection.getNotifications,
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
      <ClPageView id="notifs" scrollable={false}>
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
                name="bell-outline"
                color={styles.heroIcon.color}
                size={styles.heroIcon.fontSize}
              />
              <View style={styles.encouragement}>
                <ClText type="lead" style={styles.heroText}>
                  You're all caught up!
                </ClText>
                <ClText type="helper" dim>
                  New notifications will appear here.
                </ClText>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <NotificationCard
              key={item.key}
              body={item.body}
              createdAt={item.createdAt}
              title={item.title}
              isRead={item.isRead}
              type={item.type}
              recipientId={item.recipientId}
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
