import { api } from '../../lib/api/client'
import type { LoginDTO, RegisterDTO, AuthResponse } from '../../types/auth'

export const loginApi = async (data: LoginDTO): Promise<AuthResponse> => {
  const res = await api.post('/users/login', data)
  return res.data
}

export const registerApi = async (data: RegisterDTO): Promise<AuthResponse> => {
  const res = await api.post('/users/register', data)
  return res.data
}
