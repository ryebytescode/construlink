import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { useAuth } from '@/contexts/auth'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { formatFullName } from '@/helpers/utils'
import { ChatCollection, User } from '@/services/firebase'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {
  GiftedChat,
  type IChatMessage,
  type IMessage,
} from 'react-native-gifted-chat'

const emptyMessages: IMessage[] = []

export default function ChatScreen() {
  const styles = useStyles()
  const { userInfo } = useAuth()
  const { threadId } = useLocalSearchParams<{ threadId: string }>()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const { data: threadInfo } = useQuery({
    queryKey: ['threadInfo', threadId],
    queryFn: () => ChatCollection.getThread(threadId),
    initialData: null,
  })
  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', threadId],
    queryFn: () => ChatCollection.getMessages(threadId),
    initialData: emptyMessages,
  })

  useLayoutEffect(() => {
    async function markAsRead() {
      await ChatCollection.markThreadAsRead(threadId)
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    }

    if (threadInfo) {
      refetchMessages()

      if (!threadInfo.isRead) {
        markAsRead()
      }

      const recipient = ChatCollection.getRecipients(threadInfo.participants)[0]
      navigation.setOptions({
        title: recipient.fullName,
      })
    }
  }, [threadInfo, userInfo])

  useEffect(() => {
    if (threadInfo || messages) {
      spinnerRef.current?.hide()
    } else {
      spinnerRef.current?.show()
    }
  }, [threadInfo, messages])

  const onSend = useCallback(async (newMessages: IChatMessage[] = []) => {
    try {
      await Promise.all(
        newMessages.map((currentMessage) =>
          ChatCollection.sendMessage(
            threadId,
            currentMessage.text,
            User.get()!.uid,
            formatFullName(userInfo!.firstName, userInfo!.lastName)
          )
        )
      )

      queryClient
        .invalidateQueries({ queryKey: ['messages', threadId] })
        .then(() => {
          GiftedChat.append(messages ?? undefined, newMessages)
        })
    } catch (error) {
      console.error('Failed to send messages:', error)
    }
  }, [])

  return (
    <>
      <ClPageView
        id={`thread-${threadId}`}
        scrollable={false}
        contentContainerStyle={{ flex: 1 }}
      >
        <GiftedChat
          messages={messages ?? emptyMessages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: User.get()!.uid,
          }}
        />
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} visible />
    </>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  emptyPlaceholder: {
    alignItems: 'center',
    gap: spacing[2],
  },
  emptyIcon: {
    fontSize: sizes.icon['2xl'],
    color: resolveColor(scheme, colors.neutral[700], colors.neutral[300]),
  },
  settingsIcon: {
    color: resolveColor(scheme, colors.accent.base, colors.brand.base),
    fontSize: sizes.icon.md,
  },
}))
