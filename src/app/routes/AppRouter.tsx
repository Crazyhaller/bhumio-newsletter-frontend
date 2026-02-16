import type { JSX } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { RegisterPage } from '../../features/auth/RegisterPage'
import { LoginPage } from '../../features/auth/LoginPage'
import { DashboardPage } from '../../features/dashboard/DashboardPage'
import { ListsPage } from '../../features/lists/ListsPage'
import { SubscribersPage } from '../../features/subscribers/SubscribersPage'
import { CampaignsPage } from '../../features/campaigns/CampaignsPage'
import { CreateCampaignPage } from '../../features/campaigns/CreateCampaignPage'
import { CampaignStatsPage } from '../../features/campaigns/CampaignStatsPage'
import { TemplatesPage } from '../../features/templates/TemplatesPage'
import { OrganizationsPage } from '../../features/organizations/OrganizationsPage'
import { AutomationPage } from '../../features/automation/AutomationPage'
import { RoleGuard } from './RoleGuard'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard - All Roles */}
        <Route index element={<DashboardPage />} />

        {/* Admin + Superadmin */}
        <Route
          path="lists"
          element={
            <RoleGuard allowed={['Admin', 'Superadmin']}>
              <ListsPage />
            </RoleGuard>
          }
        />

        <Route
          path="subscribers"
          element={
            <RoleGuard allowed={['Admin', 'Superadmin']}>
              <SubscribersPage />
            </RoleGuard>
          }
        />

        <Route
          path="campaigns"
          element={
            <RoleGuard allowed={['Admin', 'Superadmin']}>
              <CampaignsPage />
            </RoleGuard>
          }
        />

        <Route
          path="campaigns/create"
          element={
            <RoleGuard allowed={['Admin', 'Superadmin']}>
              <CreateCampaignPage />
            </RoleGuard>
          }
        />

        <Route
          path="campaigns/:id/stats"
          element={
            <RoleGuard allowed={['Admin', 'Superadmin']}>
              <CampaignStatsPage />
            </RoleGuard>
          }
        />

        <Route
          path="templates"
          element={
            <RoleGuard allowed={['Admin', 'Superadmin']}>
              <TemplatesPage />
            </RoleGuard>
          }
        />

        <Route
          path="automation"
          element={
            <RoleGuard allowed={['Admin', 'Superadmin']}>
              <AutomationPage />
            </RoleGuard>
          }
        />

        {/* Superadmin Only */}
        <Route
          path="organizations"
          element={
            <RoleGuard allowed={['Superadmin']}>
              <OrganizationsPage />
            </RoleGuard>
          }
        />

        {/* Fallback inside layout */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Global fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
)
