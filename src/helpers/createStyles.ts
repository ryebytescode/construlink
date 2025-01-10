import { useAppStore } from '@/stores/app'
import type { Theme } from '@/theme'
import sizes from '@/theme/sizes'
import spacing from '@/theme/spacing'
import styled from '@/theme/styled'
import typography from '@/theme/typography'
import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

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
    const dynamicThemeProps = useAppStore(
      useShallow((state) => ({
        scheme: state.scheme,
        colors: state.colors,
      }))
    )

    const staticThemeProps = useMemo(
      () => ({
        typo: typography,
        spacing,
        sizes,
        styled,
      }),
      []
    )

    // biome-ignore lint/correctness/useExhaustiveDependencies:
    return useMemo(() => {
      const css =
        typeof styles === 'function'
          ? styles(
              { ...dynamicThemeProps, ...staticThemeProps },
              props ?? ({} as ExtraProps)
            )
          : styles
      return StyleSheet.create(css)
    }, [props, dynamicThemeProps.scheme])
  }
