import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { RegisterPage } from '../../features/auth/RegisterPage'
import { LoginPage } from '../../features/auth/LoginPage'
import { ListsPage } from '../../features/lists/ListsPage'
import { SubscribersPage } from '../../features/subscribers/SubscribersPage'

// import { DashboardPage } from '@/features/dashboard/DashboardPage'

const ProtectedRoute = ({ children }: any) => {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" />
  return children
}

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="lists" element={<ListsPage />} />
      <Route path="subscribers" element={<SubscribersPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* <Route index element={<DashboardPage />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>
)
