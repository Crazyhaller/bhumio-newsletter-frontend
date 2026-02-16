import api from '../../services/axios'
import type { Organization } from '../../types/organization'

export const getOrganizations = async (): Promise<Organization[]> => {
  const res = await api.get('/organizations')
  return res.data
}

export const createOrganization = async (name: string) => {
  const res = await api.post('/organizations', { name })
  return res.data
}
