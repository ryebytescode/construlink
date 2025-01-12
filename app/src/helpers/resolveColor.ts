import { useAppStore } from '@/stores/app'
import type { ColorValue } from 'react-native'

export function resolveColor(
  forDark: ColorValue,
  forLight: ColorValue
): ColorValue {
  return useAppStore.getState().scheme === 'dark' ? forDark : forLight
}
