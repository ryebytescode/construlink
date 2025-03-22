import { Role } from '@/lib/constants'
import { create } from 'zustand'

type State = {
  mode: 'signin' | 'signup' | null
  user: User | null
}

type Action = {
  setAuthMode: (mode: State['mode']) => void
  setRole: (role: Role | null) => void
  signIn: (user: User | null) => void
  signOut: () => void
}

const initialValues: State = {
  mode: null,
  user: null,
}

export const useAuthStore = create<State & Action>()((set) => ({
  ...initialValues,
  setAuthMode: (mode) => set({ mode }),
  setRole: (role) => set({ user: { role } as User }),
  signIn: (user) => set({ user }),
  signOut: () => set(initialValues),
}))

export const isEmployer = () =>
  useAuthStore.getState().user?.role === Role.EMPLOYER
