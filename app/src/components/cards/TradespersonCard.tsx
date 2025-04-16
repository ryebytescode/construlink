import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { capitalizeFirstLetter, formatSchedule } from '@/helpers/utils'
import typography from '@/theme/typography'
import { IconSet } from '@/types/icons'
import { router } from 'expo-router'
import { View } from 'react-native'
import { ClCard } from '../ClCard'
import { ClIcon } from '../ClIcon'
import { ClIconText } from '../ClIconText'
import { ClText } from '../ClText'

interface TradespersonCardProps extends Omit<Tradesperson, 'key'> {
  tradespersonId: string
}

export function TradespersonCard(props: TradespersonCardProps) {
  const {
    tradespersonId,
    firstName,
    lastName,
    location,
    expertise,
    verified,
    rating,
    schedule,
  } = props
  const styles = useStyles()

  const handleViewUser = () => {
    router.navigate({
      pathname: '/user/[userId]',
      params: {
        userId: tradespersonId,
      },
    })
  }

  return (
    <ClCard
      onPress={handleViewUser}
      footer={
        rating ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {Array.from({ length: 5 }).map((_, index) => {
              const isHalfStar = rating - index > 0 && rating - index < 1

              return (
                <ClIcon
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  set={IconSet.MaterialIcon}
                  name={
                    index < Math.floor(rating)
                      ? 'star'
                      : isHalfStar
                        ? 'star-half'
                        : 'star-border'
                  }
                  style={{
                    fontSize: typography.sizes.lg.fontSize,
                    color: styles.verifiedIcon.color,
                  }}
                />
              )
            })}
          </View>
        ) : (
          <ClText dim style={{ fontSize: typography.sizes.sm.fontSize }}>
            No ratings yet
          </ClText>
        )
      }
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <ClText
            weight="bold"
            style={{
              fontSize: typography.sizes.lg.fontSize,
              flexWrap: 'wrap',
            }}
          >
            {`${firstName} ${lastName}`}
          </ClText>
          <ClText style={{ fontSize: typography.sizes.sm.fontSize }}>
            {capitalizeFirstLetter(expertise[0])}
          </ClText>
        </View>
        {verified && (
          <View>
            <ClIcon
              set={IconSet.MaterialIcon}
              name="verified"
              style={styles.verifiedIcon}
            />
          </View>
        )}
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
            name: 'calendar',
          }}
          text={
            schedule ? `Available ${formatSchedule(schedule)}` : 'No schedule'
          }
          style={{ fontSize: typography.sizes.sm.fontSize }}
        />
      </View>
    </ClCard>
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
  verifiedIcon: {
    fontSize: typography.sizes.base.fontSize,
    color: resolveColor(scheme, colors.accent[500], colors.brand[500]),
  },
}))
