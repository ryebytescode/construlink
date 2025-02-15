import { useTheme } from '@/contexts/theme'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Typo } from '@/theme'
import { Stack } from 'expo-router'
import type { ComponentProps } from 'react'
import { ClBackArrow } from '../ClBackArrow'

type ClStackProps = Omit<ComponentProps<typeof Stack>, 'id'> & { id: string }

export function ClStack({
  id,
  children,
  screenOptions,
  ...rest
}: ClStackProps) {
  useRenderCount(`ClStack: ${id}`)

  const { colors } = useTheme()

  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.primaryText,
        headerShadowVisible: false,
        headerLeft: (props) => <ClBackArrow {...props} />,
        headerBackVisible: false,
        headerTitleStyle: {
          ...Typo.fontMap.bold,
          color: colors.primaryText,
        },
        ...screenOptions,
      }}
      {...rest}
    >
      {children}
    </Stack>
  )
}
