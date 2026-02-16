import { useState, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { AuthContext, type JwtPayload } from './AuthContext'

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
