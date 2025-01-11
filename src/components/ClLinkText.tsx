import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { Link, type LinkProps } from 'expo-router'
import type { StyleProp, TextStyle } from 'react-native'
import { ClText, type ClTextProps } from './ClText'

interface ClLinkTextProps extends LinkProps {
  linkStyle?: StyleProp<TextStyle>
  textProps?: Partial<ClTextProps>
}

export function ClLinkText({
  linkStyle,
  style,
  children,
  textProps,
  ...rest
}: ClLinkTextProps) {
  const styles = useStyles()

  return (
    <Link style={linkStyle} {...rest} adjustsFontSizeToFit>
      <ClText weight="semiBold" style={[styles.text, style]} {...textProps}>
        {children}
      </ClText>
    </Link>
  )
}

const useStyles = createStyles(({ colors }) => ({
  text: {
    color: resolveColor(colors.accent[500], colors.brand[600]),
  },
}))
