import axios from 'axios'
import { useAuthStore } from '../../app/store/authStore'

export const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const { token, currentOrg } = useAuthStore.getState()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (currentOrg) {
    config.headers['x-org-id'] = currentOrg.id
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
