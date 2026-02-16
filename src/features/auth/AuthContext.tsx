import { createContext, useContext, useState, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  userId: string
  organizationId: string
  role: string
}

interface AuthContextType {
  token: string | null
  user: JwtPayload | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedToken = localStorage.getItem('token')
  const [token, setToken] = useState<string | null>(storedToken)
  const [user, setUser] = useState<JwtPayload | null>(
    storedToken ? jwtDecode(storedToken) : null,
  )

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(jwtDecode(newToken))
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthContext not found')
  return ctx
}
