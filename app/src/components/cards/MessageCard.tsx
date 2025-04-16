import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { truncateString } from '@/helpers/utils'
import { ChatCollection } from '@/services/firebase'
import { Spacing } from '@/theme'
import { formatDistanceToNowStrict } from 'date-fns'
import { router } from 'expo-router'
import { View } from 'react-native'
import { ClAvatar } from '../ClAvatar'
import { ClCard } from '../ClCard'
import { ClDuration } from '../ClDuration'
import { ClText } from '../ClText'

interface MessageCardProps extends Omit<ChatThread, 'key'> {
  threadId: string
}

export function MessageCard(props: MessageCardProps) {
  const {
    createdAt,
    lastMessage,
    lastMessageAt,
    lastSenderId,
    participants,
    threadId,
    isRead,
  } = props
  const styles = useStyles()
  const recipient = ChatCollection.getRecipients(participants)[0]

  return (
    <ClCard
      onPress={() => router.push(`/user/messages/${threadId}`)}
      style={[!isRead && styles.cardUnread]}
    >
      <View style={{ flexDirection: 'row', gap: Spacing[4] }}>
        <ClAvatar size="md" source={recipient?.avatarUrl} />
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <ClText weight={!isRead ? 'bold' : 'regular'}>
              {truncateString(recipient!.fullName, 15)}
            </ClText>
            <ClDuration timestamp={lastMessageAt.toDate()} addSuffix={false} />
          </View>
          <ClText type="helper" weight={!isRead ? 'semiBold' : 'regular'} dim>
            {truncateString(lastMessage, 25)}
          </ClText>
        </View>
      </View>
    </ClCard>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  cardUnread: {
    backgroundColor: resolveColor(
      scheme,
      colors.neutral[700],
      colors.neutral[100]
    ),
  },
}))
