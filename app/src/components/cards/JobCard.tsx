import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { Cl } from '@/lib/options'
import { CompanyCollection } from '@/services/firebase'
import typography from '@/theme/typography'
import { IconSet } from '@/types/icons'
import { formatDistanceToNowStrict } from 'date-fns'
import { router, useFocusEffect } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ClCard } from '../ClCard'
import { ClIconText } from '../ClIconText'
import { ClText } from '../ClText'

interface JobCardProps
  extends Pick<
    Job,
    'authorId' | 'title' | 'location' | 'postAs' | 'employmentType' | 'status'
  > {
  jobId: string
  postTime: Date
  pickMode?: boolean
  selected?: boolean
  onSelect?: (id: string) => void
}

export function JobCard(props: JobCardProps) {
  const {
    jobId,
    title,
    location,
    postAs,
    postTime,
    employmentType,
    status,
    pickMode,
    selected,
    onSelect,
  } = props
  const [isSelected, setIsSelected] = useState(false)
  const styles = useStyles()

  const handleViewJobPost = () => {
    if (pickMode) {
      onSelect?.(jobId)
      setIsSelected(!isSelected)
    } else {
      router.navigate({
        pathname: '/user/job/[jobId]',
        params: {
          jobId,
        },
      })
    }
  }

  return (
    <ClCard
      onPress={handleViewJobPost}
      style={selected && styles.selected}
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
        <JobAuthor authorId={props.authorId} postAs={postAs} />
      </View>
      <View>
        <ClIconText
          icon={{
            set: IconSet.MaterialCommunityIcons,
            name: 'map-marker',
          }}
          text={location}
          style={{ fontSize: typography.sizes.sm.fontSize }}
        />
        <ClIconText
          icon={{
            set: IconSet.MaterialCommunityIcons,
            name: 'briefcase',
          }}
          text={
            Cl.employmentTypes.find((option) => option.value === employmentType)
              ?.label!
          }
          style={{ fontSize: typography.sizes.sm.fontSize }}
        />
      </View>
      <JobPostedAgo timestamp={postTime} />
    </ClCard>
  )
}

function JobAuthor({ authorId, postAs }: { authorId: string; postAs: string }) {
  const [authorName, setAuthorName] = useState('...')

  useEffect(() => {
    if (postAs === 'company') {
      CompanyCollection.getCompanyDetails(authorId).then((company) => {
        if (company) setAuthorName(company.name)
      })
    } else {
      setAuthorName('Invididual Employer')
    }
  }, [])

  return (
    <ClText style={{ fontSize: typography.sizes.sm.fontSize }}>
      {authorName}
    </ClText>
  )
}

function JobPostedAgo({ timestamp }: { timestamp: Date }) {
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
      {distance ? `Posted ${distance}` : 'Just now'}
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
