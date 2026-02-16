import { create } from 'zustand'
import type { User, Organization } from '../../types/auth'

interface AuthState {
  token: string | null
  user: User | null
  currentOrg: Organization | null
  setOrganization: (org: Organization) => void
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  currentOrg: null,

  setOrganization: (org) => set({ currentOrg: org }),

  login: (token, user) =>
    set({
      token,
      user,
      currentOrg: null,
    }),

  logout: () =>
    set({
      token: null,
      user: null,
      currentOrg: null,
    }),
}))
