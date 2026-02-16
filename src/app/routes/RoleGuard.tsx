import { Navigate } from 'react-router-dom'
import type { JSX } from 'react'
import type { UserRole } from '../../types/auth'
import { useAuthStore } from '../store/authStore'

export const RoleGuard = ({
  children,
  allowed,
}: {
  children: JSX.Element
  allowed: UserRole[]
}) => {
  const role = useAuthStore((s) => s.user?.role)

  if (!role) return <Navigate to="/login" replace />

  if (!allowed.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}
