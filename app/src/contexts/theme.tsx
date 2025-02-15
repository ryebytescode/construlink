import { useRenderCount } from '@/hooks/useRenderCount'
import { Palette } from '@/theme'
import { default as Colors, type Scheme } from '@/theme/palette'
import * as NavigationBar from 'expo-navigation-bar'
import * as SystemUI from 'expo-system-ui'
import type React from 'react'
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Appearance } from 'react-native'

interface ThemeContextProps {
  scheme: Scheme
  colors: typeof Colors.light | typeof Colors.dark
  changeScheme(scheme: Scheme): void
}

const initialDeviceScheme = Appearance.getColorScheme() as Scheme

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps)

export function ClThemeProvider({ children }: PropsWithChildren) {
  useRenderCount('ThemeProvider')

  const [scheme, setScheme] = useState<Scheme>(initialDeviceScheme)
  const [colors, setColors] = useState<ThemeContextProps['colors']>(
    Colors[initialDeviceScheme]
  )

  function changeScheme(newScheme: Scheme) {
    setScheme(newScheme)
    setColors(Colors[newScheme])
  }

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) changeScheme(colorScheme)
    })

    return subscription.remove
  }, [])

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Palette[scheme].background)
    NavigationBar.setBackgroundColorAsync(Palette[scheme].background)
  }, [scheme])

  return (
    <ThemeContext.Provider value={{ scheme, colors, changeScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
