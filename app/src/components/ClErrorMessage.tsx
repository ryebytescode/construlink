import { useTheme } from '@/contexts/theme'
import { resolveColor } from '@/helpers/resolveColor'
import { useAppStore } from '@/stores/app'
import { Typo } from '@/theme'
import { type TextProps, View } from 'react-native'
import { ClText } from './ClText'

export function ClErrorMessage({
  message,
  ...rest
}: TextProps & { message?: string }) {
  const { scheme, colors } = useTheme()

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      <ClText
        type="helper"
        style={{
          color: resolveColor(
            scheme,
            colors.states.danger[300],
            colors.states.danger[400]
          ),
          ...Typo.fontMap.semiBold,
        }}
        {...rest}
      >
        {message}
      </ClText>
    </View>
  )
}
