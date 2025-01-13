import { Role } from '@/lib/constants'
import type { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { create } from 'zustand'

type State = {
  role: Role | null
  mode: 'signin' | 'signup' | null
  user: FirebaseAuthTypes.User | null
}

type Action = {
  setRole: (role: Role | null) => void
  setMode: (mode: State['mode']) => void
  setUser: (user: State['user']) => void
}

export const useAuthStore = create<State & Action>()((set) => ({
  role: null,
  mode: null,
  user: null,
  setRole: (role) => set({ role }),
  setMode: (mode) => set({ mode }),
  setUser: (user) => set({ user }),
}))

export const isEmployer = () => useAuthStore.getState().role === Role.EMPLOYER
