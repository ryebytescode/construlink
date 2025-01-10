import type { Role } from '@/lib/constants'
import { create } from 'zustand'

type State = {
  role: Role | null
}

type Action = {
  setRole: (role: Role | null) => void
}

export const useAuthStore = create<State & Action>()((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}))
