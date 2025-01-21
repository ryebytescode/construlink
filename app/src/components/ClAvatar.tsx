import { createStyles } from '@/helpers/createStyles'
import { Status } from '@/lib/constants'
import type { Sizes } from '@/theme'
import { Image, type ImageProps } from 'expo-image'
import React from 'react'
import { View } from 'react-native'

interface ClAvatarProps {
  source?: ImageProps['source']
  size?: keyof typeof Sizes.avatar
  status?: Status
}

export function ClAvatar({ source, size, status }: ClAvatarProps) {
  const styles = useStyles({ size, status })

  return (
    <>
      <View style={styles.avatarCropper}>
        <Image
          source={source}
          style={styles.avatar}
          placeholder={require('@/assets/images/avatar_placeholder.png')}
          transition={1000}
        />
      </View>
      {status !== undefined && <View style={styles.online} />}
    </>
  )
}

const useStyles = createStyles(
  (
    { colors, spacing, sizes, typo },
    {
      size,
      status,
    }: {
      size: ClAvatarProps['size']
      status: ClAvatarProps['status']
    }
  ) => ({
    avatarCropper: {
      width: sizes.avatar[size ?? 'xl'],
      height: sizes.avatar[size ?? 'xl'],
      borderRadius: sizes.radius.full,
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    online: {
      width: sizes.icon.xs,
      height: sizes.icon.xs,
      borderRadius: sizes.radius.full,
      backgroundColor:
        status === Status.ONLINE
          ? colors.states.success[600]
          : colors.states.warning[400],
      bottom: spacing[2],
      position: 'absolute',
      right: spacing[0.5],
    },
  })
)
