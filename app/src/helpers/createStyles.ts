import { useTheme } from '@/contexts/theme'
import type { Theme } from '@/theme'
import sizes from '@/theme/sizes'
import spacing from '@/theme/spacing'
import styled from '@/theme/styled'
import typography from '@/theme/typography'
import { useMemo } from 'react'
import { StyleSheet } from 'react-native'

export const createStyles =
  <
    StyleType extends
      | StyleSheet.NamedStyles<StyleType>
      // biome-ignore lint/suspicious/noExplicitAny:
      | StyleSheet.NamedStyles<any>,
    ExtraProps extends object,
  >(
    styles: StyleType | ((theme: Theme, props: ExtraProps) => StyleType)
  ) =>
  (props?: ExtraProps): StyleType => {
    const { scheme, colors } = useTheme()
    const staticThemeProps = useMemo(
      () => ({
        typo: typography,
        spacing,
        sizes,
        styled,
      }),
      []
    )

    return useMemo(() => {
      const css =
        typeof styles === 'function'
          ? styles(
              { scheme, colors, ...staticThemeProps },
              props ?? ({} as ExtraProps)
            )
          : styles
      return StyleSheet.create(css)
    }, [props, scheme])
  }
