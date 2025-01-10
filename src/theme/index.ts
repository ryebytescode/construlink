import type palette from './palette'
import type { Scheme } from './palette'
import type sizes from './sizes'
import type spacing from './spacing'
import type styled from './styled'
import type typography from './typography'

export { default as Palette } from './palette'
export { default as Sizes } from './sizes'
export { default as Spacing } from './spacing'
export { default as Styled } from './styled'
export { default as Typo } from './typography'

export interface Theme {
  scheme: Scheme
  colors: typeof palette.light | typeof palette.dark
  typo: typeof typography
  spacing: typeof spacing
  sizes: typeof sizes
  styled: typeof styled
}
