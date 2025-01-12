import type { Scheme } from '@/theme/palette'
import { useColorScheme } from 'react-native'

const DEFAULT_SCHEME: Scheme = 'dark'

export function useScheme(): Scheme {
  return useColorScheme() ?? DEFAULT_SCHEME
}
