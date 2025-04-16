import { ClIcon } from '@/components/ClIcon'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { MessageCard } from '@/components/cards/MessageCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { ChatCollection } from '@/services/firebase'
import { IconSet } from '@/types/icons'
import { Timestamp } from '@react-native-firebase/firestore'
import { useQueryClient } from '@tanstack/react-query'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

export default function MessagesTab() {
  const styles = useStyles()
  const queryClient = useQueryClient()
  const [isRefetching, setIsRefetching] = useState(false)

  const getThreads = useCallback(() => {
    setIsRefetching(true)

    const query = ChatCollection.getThreadsQuery()
    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        const threads: ChatThread[] = []
        // biome-ignore lint/complexity/noForEach: <explanation>
        snapshot.forEach((doc) => {
          threads.push({ ...doc.data(), key: doc.id } as ChatThread)
        })

        queryClient.setQueryData(['threads'], threads)
      },
      (error) => {
        console.error('Error fetching threads:', error)
      }
    )

    setIsRefetching(false)

    return unsubscribe
  }, [])

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = getThreads()
      return unsubscribe
    }, [])
  )

  return (
    <ClPageView
      id="messages-tab"
      scrollable={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <FlatList
        data={queryClient.getQueryData(['threads']) as ChatThread[]}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.entries}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={getThreads} />
        }
        ListEmptyComponent={
          <View style={styles.emptyPlaceholder}>
            <ClIcon
              set={IconSet.MaterialCommunityIcons}
              name="message-outline"
              color={styles.heroIcon.color}
              size={styles.heroIcon.fontSize}
            />
            <View style={styles.encouragement}>
              <ClText type="lead" style={styles.heroText}>
                It's quiet here...
              </ClText>
              <ClText type="helper" dim style={{ textAlign: 'center' }}>
                Your chats will show up once you start a conversation.
              </ClText>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <MessageCard
            threadId={item.key}
            participants={item.participants}
            lastMessage={item.lastMessage}
            createdAt={item.createdAt}
            lastMessageAt={
              new Timestamp(item.createdAt.seconds, item.createdAt.nanoseconds)
            }
            isRead={item.isRead}
            lastSenderId={item.lastSenderId}
            participantIds={item.participantIds}
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
