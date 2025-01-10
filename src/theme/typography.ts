import { Platform, type TextStyle } from 'react-native'

export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type TextType = Heading | 'paragraph' | 'lead' | 'helper' | 'link'
export type Weight =
  | 'thin'
  | 'extraLight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semiBold'
  | 'bold'
  | 'extraBold'
  | 'black'

const weights: Record<Weight, TextStyle['fontWeight']> = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 'heavy',
  extraBold: 'semibold',
  black: 'black',
}

const fontMap: Record<Weight, TextStyle> = {
  thin: {
    fontFamily: Platform.select({
      android: 'Poppins_100Thin',
      ios: 'Poppins-Thin',
    }),
    fontWeight: weights.thin,
  },
  extraLight: {
    fontFamily: Platform.select({
      android: 'Poppins_200ExtraLight',
      ios: 'Poppins-ExtraLight',
    }),
    fontWeight: weights.extraLight,
  },
  light: {
    fontFamily: Platform.select({
      android: 'Poppins_300Light',
      ios: 'Poppins-Light',
    }),
    fontWeight: weights.light,
  },
  regular: {
    fontFamily: Platform.select({
      android: 'Poppins_400Regular',
      ios: 'Poppins-Regular',
    }),
    fontWeight: weights.regular,
  },
  medium: {
    fontFamily: Platform.select({
      android: 'Poppins_500Medium',
      ios: 'Poppins-Medium',
    }),
    fontWeight: weights.medium,
  },
  semiBold: {
    fontFamily: Platform.select({
      android: 'Poppins_600SemiBold',
      ios: 'Poppins-SemiBold',
    }),
    fontWeight: weights.semiBold,
  },
  bold: {
    fontFamily: Platform.select({
      android: 'Poppins_700Bold',
      ios: 'Poppins-Bold',
    }),
    fontWeight: weights.bold,
  },
  extraBold: {
    fontFamily: Platform.select({
      android: 'Poppins_800ExtraBold',
      ios: 'Poppins-ExtraBold',
    }),
    fontWeight: weights.extraBold,
  },
  black: {
    fontFamily: Platform.select({
      android: 'Poppins_900Black',
      ios: 'Poppins-Black',
    }),
    fontWeight: weights.black,
  },
}

const sizes: Record<string, Pick<TextStyle, 'fontSize' | 'lineHeight'>> = {
  xs: {
    fontSize: 12,
    lineHeight: 16,
  },
  sm: {
    fontSize: 14,
    lineHeight: 20,
  },
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    fontSize: 18,
    lineHeight: 28,
  },
  xl: {
    fontSize: 20,
    lineHeight: 32,
  },
  '2xl': {
    fontSize: 24,
    lineHeight: 36,
  },
  '3xl': {
    fontSize: 28,
    lineHeight: 40,
  },
  '4xl': {
    fontSize: 32,
    lineHeight: 44,
  },
  '5xl': {
    fontSize: 36,
    lineHeight: 48,
  },
  '6xl': {
    fontSize: 40,
    lineHeight: 52,
  },
}

const presets = {
  h1: sizes['5xl'],
  h2: sizes['4xl'],
  h3: sizes['3xl'],
  h4: sizes['2xl'],
  h5: sizes.xl,
  h6: sizes.lg,
  lead: sizes.xl,
  paragraph: sizes.base,
  helper: sizes.sm,
  link: sizes.base,
}

export default {
  weights,
  fontMap,
  sizes,
  presets,
}
