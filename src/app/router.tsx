import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import DashboardLayout from '../components/layout/DashboardLayout'
import DashboardPage from '../features/dashboard/DashboardPage'
import ProtectedRoute from '../features/auth/ProtectedRoute'
import OrganizationsPage from '../features/organizations/pages/OrganizationsPage'

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="organizations" element={<OrganizationsPage />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
