import axios from 'axios'
import { useAuthStore } from '../../app/store/authStore'

export const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  const org = useAuthStore.getState().currentOrg

  if (token) config.headers.Authorization = `Bearer ${token}`
  if (org) config.headers['x-org-id'] = org.id

  return config
})
