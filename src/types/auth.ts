export type UserRole = 'Superadmin' | 'Admin' | 'User'

export interface Organization {
  id: string
  name: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  organizationId: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  email: string
  password: string
  organizationName: string
}
