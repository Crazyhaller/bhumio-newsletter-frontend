import { api } from '../../lib/api/client'
import type { Organization } from '../../types/auth'

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const res = await api.get('/organizations')
  return res.data
}

export const createOrganization = async (
  name: string,
): Promise<Organization> => {
  const res = await api.post('/organizations', { name })
  return res.data
}
