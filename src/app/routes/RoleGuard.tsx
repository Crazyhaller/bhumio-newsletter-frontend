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

  if (!role || !allowed.includes(role)) {
    return <Navigate to="/" />
  }

  return children
}
