import type { Scheme } from '@/theme/palette'
import type { ColorValue } from 'react-native'

export function resolveColor(
  scheme: Scheme,
  forDark: ColorValue,
  forLight: ColorValue
): ColorValue {
  return scheme === 'dark' ? forDark : forLight
}
