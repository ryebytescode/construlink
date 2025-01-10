import type { Role } from '@/lib/constants'
import { create } from 'zustand'

type State = {
  role: Role | null
  mode: 'signin' | 'signup' | null
}

type Action = {
  setRole: (role: Role | null) => void
  setMode: (mode: State['mode']) => void
}

export const useAuthStore = create<State & Action>()((set) => ({
  role: null,
  mode: null,
  setRole: (role) => set({ role }),
  setMode: (mode) => set({ mode }),
}))
