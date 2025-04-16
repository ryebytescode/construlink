import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import typography from '@/theme/typography'
import { formatDistanceToNowStrict } from 'date-fns'
import { router, useFocusEffect } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ClCard } from '../ClCard'
import { ClText } from '../ClText'

interface SavedProfileCardProps {
  profileId: string
  tradespersonName: string
  savedAt: Timestamp
  selected?: boolean
  onSelect?: (id: string) => void
}

export function SavedProfileCard(props: SavedProfileCardProps) {
  const { profileId, tradespersonName, savedAt, onSelect, selected } = props
  const styles = useStyles()

  function handleViewUserProfile() {
    router.push({
      pathname: '/user/[userId]',
      params: {
        userId: profileId,
      },
    })
  }

  return (
    <ClCard onPress={handleViewUserProfile} style={selected && styles.selected}>
      <View>
        <ClText
          weight="bold"
          style={{
            fontSize: typography.sizes.lg.fontSize,
            flexWrap: 'wrap',
          }}
        >
          {tradespersonName}
        </ClText>
      </View>
      <Duration timestamp={savedAt.toDate()} />
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
