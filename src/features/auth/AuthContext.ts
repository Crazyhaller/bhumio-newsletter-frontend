import { createContext } from 'react'

export interface JwtPayload {
  userId: string
  organizationId: string
  role: string
}

export interface AuthContextType {
  token: string | null
  user: JwtPayload | null
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
