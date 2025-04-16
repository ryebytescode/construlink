import { useAuth } from '@/contexts/auth'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { capitalizeFirstLetter, formatFullName } from '@/helpers/utils'
import { Role } from '@/lib/constants'
import { IconSet } from '@/types/icons'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { AvatarUploader } from '../AvatarUploader'
import { ClButton } from '../ClButton'
import { ClText } from '../ClText'

interface Stat {
  value: number
  label: string
}

interface ProfileCardProps {
  details: User
  userId: string
  self?: boolean
}

export function ProfileCard(props: ProfileCardProps) {
  const { details, userId, self } = props
  const styles = useStyles()
  const { userInfo } = useAuth()

  return (
    <BottomSheetModalProvider>
      <View style={styles.profileCard}>
        <AvatarUploader />
        <View>
          <ClText type="h6" style={styles.name}>
            {formatFullName(details.firstName, details.lastName)}
          </ClText>
          <ClText type="helper" style={styles.role} dim>
            {capitalizeFirstLetter(details.role!)}
          </ClText>
        </View>
        {/* <StatsContainer role={details.role} /> */}
        {!self && (
          <View style={styles.ctaButtons}>
            <ClButton
              text="Message"
              size="small"
              icon={{ set: IconSet.MaterialCommunityIcons, name: 'message' }}
            />
            {userInfo!.role === Role.EMPLOYER && (
              <ClButton
                text="Hire Me"
                size="small"
                icon={{
                  set: IconSet.MaterialCommunityIcons,
                  name: 'account-plus',
                }}
                onPress={() =>
                  router.push({
                    pathname: '/user/job/hire',
                    params: { userId },
                  })
                }
              />
            )}
          </View>
        )}
      </View>
    </BottomSheetModalProvider>
  )
}

function StatsContainer({ role }: { role: Role }) {
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
          label: 'Jobs Done',
          value: 0,
        },
        {
          label: 'Rating',
          value: 0,
        },
      ],
    }),
    []
  )

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
            {5}
          </ClText>
          <ClText type="helper" style={styles.statLabel}>
            {element.label}
          </ClText>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  profileCard: {
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: resolveColor(
      scheme,
      colors.neutral[800],
      colors.neutral[100]
    ),
    paddingVertical: spacing[4],
    borderRadius: sizes.radius['2xl'],
    borderWidth: sizes.borderWidth.thin,
    borderColor: resolveColor(scheme, colors.neutral[700], colors.neutral[200]),
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
    borderTopColor: resolveColor(
      scheme,
      colors.neutral[700],
      colors.neutral[200]
    ),
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
  ctaButtons: {
    marginTop: spacing[2],
    flexDirection: 'row',
    gap: spacing[2],
  },
}))
