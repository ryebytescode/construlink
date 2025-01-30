import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { Role } from '@/lib/constants'
import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { AvatarUploader } from '../AvatarUploader'
import { ClText } from '../ClText'

interface Stat {
  value: number
  label: string
}

interface ProfileCardProps {
  name: string
  designation: string
  role: Role
  stats: Stats
}

export function ProfileCard(props: ProfileCardProps) {
  const { name, designation, role, stats } = props
  const styles = useStyles()

  return (
    <View style={styles.profileCard}>
      <AvatarUploader />
      <View>
        <ClText type="h6" style={styles.name}>
          {name}
        </ClText>
        <ClText type="helper" style={styles.role} dim>
          {designation}
        </ClText>
      </View>
      <StatsContainer role={role} stats={stats} />
    </View>
  )
}

function StatsContainer({
  role,
  stats,
}: { role: Role; stats: ProfileCardProps['stats'] }) {
  const styles = useStyles()

  const elements: Record<Role, Stat[]> = useMemo(
    () => ({
      [Role.EMPLOYER]: [
        {
          label: 'Job Posts',
          value: 0,
        },
        {
          label: 'Hired',
          value: 0,
        },
        {
          label: 'Rating',
          value: 0,
        },
      ],
      [Role.TRADESPERSON]: [
        {
          label: 'Applications',
          value: 0,
        },
      ],
    }),
    []
  )

  console.log(role)

  const handleStatPress = () => {
    // router.push('/(main)/(user)/stats')
  }

  return (
    <View style={styles.statsContainer}>
      {elements[role].map((element) => (
        <TouchableOpacity
          key={element.label}
          style={styles.stat}
          onPress={handleStatPress}
        >
          <ClText type="lead" style={styles.statNumber}>
            {element.value}
          </ClText>
          <ClText type="helper" style={styles.statLabel}>
            {element.label}
          </ClText>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const useStyles = createStyles(({ colors, spacing, sizes, typo }) => ({
  profileCard: {
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: resolveColor(colors.neutral[800], colors.neutral[100]),
    paddingVertical: spacing[4],
    borderRadius: sizes.radius['2xl'],
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(colors.neutral[700], colors.neutral[200]),
  },
  name: {
    ...typo.fontMap.bold,
    textAlign: 'center',
  },
  role: {
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingTop: spacing[4],
    borderTopWidth: sizes.borderWidth.thin,
    borderTopColor: resolveColor(colors.neutral[700], colors.neutral[200]),
  },
  stat: {
    flex: 1,
  },
  statNumber: {
    ...typo.fontMap.bold,
    textAlign: 'center',
  },
  statLabel: {
    textAlign: 'center',
  },
}))
