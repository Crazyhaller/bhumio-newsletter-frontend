export interface User {
  id: string
  email: string
  organizationId: string
  role: 'Superadmin' | 'Admin' | 'User'
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
