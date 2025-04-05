import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { capitalizeFirstLetter } from '@/helpers/utils'
import { HireRequestStatus } from '@/lib/constants'
import { Spacing } from '@/theme'
import typography from '@/theme/typography'
import { IconSet } from '@/types/icons'
import { formatDistanceToNowStrict } from 'date-fns'
import { router, useFocusEffect } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ClCard } from '../ClCard'
import { ClIconText } from '../ClIconText'
import { ClText } from '../ClText'

interface HireRequestCardProps
  extends Pick<
    HireRequest,
    | 'jobType'
    | 'location'
    | 'expectedStartDate'
    | 'budget'
    | 'status'
    | 'tradespersonName'
    | 'createdAt'
  > {
  hireRequestId: string
  selected?: boolean
  onSelect?: (id: string) => void
}

export function HireRequestCard(props: HireRequestCardProps) {
  const {
    hireRequestId,
    tradespersonName,
    createdAt,
    jobType,
    location,
    status,
    selected,
    onSelect,
  } = props
  const styles = useStyles()

  function handleViewHireRequest() {
    router.navigate({
      pathname: '/user/job/view-hire-request',
      params: {
        hireRequestId,
      },
    })
  }

  return (
    <ClCard
      onPress={handleViewHireRequest}
      style={selected && styles.selected}
      footer={
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing[2],
          }}
        >
          <View style={styles.statusIndicator} />
          <ClText type="helper" dim>
            {capitalizeFirstLetter(status)}
          </ClText>
        </View>
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
          {tradespersonName}
        </ClText>
      </View>
      <View>
        <ClIconText
          icon={{
            set: IconSet.MaterialCommunityIcons,
            name: 'wrench',
          }}
          text={capitalizeFirstLetter(jobType)}
          style={{ fontSize: typography.sizes.sm.fontSize }}
        />
        <ClIconText
          icon={{
            set: IconSet.MaterialCommunityIcons,
            name: 'map-marker',
          }}
          text={location}
          style={{ fontSize: typography.sizes.sm.fontSize }}
        />
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

const useStyles = createStyles(
  (
    { scheme, colors, spacing, sizes, typo },
    { status }: { status: HireRequestStatus }
  ) => ({
    selected: {
      backgroundColor: resolveColor(
        scheme,
        colors.accent[800],
        colors.brand[50]
      ),
      borderRadius: sizes.radius['2xl'],
      borderWidth: sizes.borderWidth.thin,
      borderColor: resolveColor(scheme, colors.accent[700], colors.brand[200]),
    },
    saveIcon: {
      color: resolveColor(scheme, colors.accent[500], colors.brand[50]),
    },
    statusIndicator: {
      width: sizes.icon.xs,
      height: sizes.icon.xs,
      borderRadius: sizes.radius.full,
      backgroundColor: (() => {
        switch (status) {
          case HireRequestStatus.PENDING:
            return resolveColor(
              scheme,
              colors.neutral[500],
              colors.neutral[300]
            )
          case HireRequestStatus.ACCEPTED:
            return resolveColor(
              scheme,
              colors.states.success[500],
              colors.states.success[300]
            )
          case HireRequestStatus.REJECTED:
            return resolveColor(
              scheme,
              colors.states.danger[500],
              colors.states.danger[300]
            )
          default:
            return resolveColor(
              scheme,
              colors.neutral[500],
              colors.neutral[300]
            )
        }
      })(),
    },
  })
)
