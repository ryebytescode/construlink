import { default as Colors, type Scheme } from '@/theme/palette'
import { Appearance } from 'react-native'
import { create } from 'zustand'

type State = {
  scheme: Scheme
  colors: typeof Colors.light | typeof Colors.dark
}

type Action = {
  changeScheme: (scheme: Scheme) => void
}

const initialDeviceScheme = Appearance.getColorScheme() as Scheme

export const useAppStore = create<State & Action>()((set) => ({
  scheme: initialDeviceScheme,
  colors: Colors[initialDeviceScheme],
  changeScheme: (scheme) =>
    set({
      scheme,
      colors: Colors[scheme],
    }),
}))
