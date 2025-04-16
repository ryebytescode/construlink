import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import type { NotificationType } from '@/lib/constants'
import typography from '@/theme/typography'
import { formatDistanceToNowStrict } from 'date-fns'
import { router, useFocusEffect } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ClCard } from '../ClCard'
import { ClText } from '../ClText'

interface NotificationCardProps {
  createdAt: Timestamp
  recipientId: string
  title: string
  body: string
  isRead: boolean
  type: NotificationType
}

export function NotificationCard(props: NotificationCardProps) {
  const { title, body, createdAt } = props
  const styles = useStyles()

  function handleViewNotification() {
    // router.push({
    //   pathname: link,
    //   params: {
    //     userId: profileId,
    //   },
    // })
  }

  return (
    <ClCard onPress={handleViewNotification}>
      <View>
        <ClText
          weight="bold"
          style={{
            fontSize: typography.sizes.lg.fontSize,
            flexWrap: 'wrap',
          }}
        >
          {title}
        </ClText>
        <ClText>{body}</ClText>
      </View>
      <Duration timestamp={createdAt.toDate()} />
    </ClCard>
  )
}

function Duration({ timestamp }: { timestamp: Date }) {
  const [distance, setDistance] = useState('')

  const computeDistance = () => {
    return formatDistanceToNowStrict(timestamp, {
      addSuffix: true,
    })
  }

  useEffect(() => {
    setDistance(computeDistance())

    const timeout = setInterval(() => {
      setDistance(computeDistance())
    }, 30000)

    return () => clearInterval(timeout)
  }, [])

  // Update on focus
  useFocusEffect(() => {
    setDistance(computeDistance())
  })

  return (
    <ClText
      style={{ fontSize: typography.sizes.xs.fontSize }}
      type="helper"
      dim
    >
      {distance ?? 'Just now'}
    </ClText>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  selected: {
    backgroundColor: resolveColor(scheme, colors.accent[800], colors.brand[50]),
    borderRadius: sizes.radius['2xl'],
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(scheme, colors.accent[700], colors.brand[200]),
  },
  saveIcon: {
    color: resolveColor(scheme, colors.accent[500], colors.brand[50]),
  },
}))
