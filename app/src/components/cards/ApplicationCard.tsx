import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import type { JobApplicationStatus } from '@/lib/constants'
import typography from '@/theme/typography'
import { IconSet } from '@/types/icons'
import { formatDistanceToNowStrict } from 'date-fns'
import { router, useFocusEffect } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ClCard } from '../ClCard'
import { ClIconText } from '../ClIconText'
import { ClText } from '../ClText'

interface JobCardProps {
  applicationId: string
  applyTime: Date
  title: string
  employer: string
  status: JobApplicationStatus
}

export function ApplicationCard(props: JobCardProps) {
  const { applicationId, title, employer, applyTime, status } = props
  const styles = useStyles()

  const handleViewJobPost = () => {
    router.navigate({
      pathname: '/user/job/view-application',
      params: {
        applicationId,
      },
    })
  }

  return (
    <ClCard
      onPress={handleViewJobPost}
      footer={
        status === 'pending' ? (
          <ClIconText
            icon={{
              set: IconSet.MaterialCommunityIcons,
              name: 'progress-clock',
            }}
            text={
              status === 'pending' ? 'This post is pending approval.' : 'Active'
            }
            dim
          />
        ) : undefined
      }
    >
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
      </View>
      <View>
        <ClIconText
          icon={{
            set: IconSet.MaterialCommunityIcons,
            name: 'account',
          }}
          text={employer}
          style={{ fontSize: typography.sizes.sm.fontSize }}
        />
      </View>
      <JobAppliedAgo timestamp={applyTime} />
    </ClCard>
  )
}

function JobAppliedAgo({ timestamp }: { timestamp: Date }) {
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
      {distance ? `Applied ${distance}` : 'Just now'}
    </ClText>
  )
}

const useStyles = createStyles(({ colors, spacing, sizes, typo }) => ({
  selected: {
    backgroundColor: resolveColor(colors.accent[800], colors.brand[50]),
    borderRadius: sizes.radius['2xl'],
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(colors.accent[700], colors.brand[200]),
  },
  saveIcon: {
    color: resolveColor(colors.accent[500], colors.brand[50]),
  },
}))
