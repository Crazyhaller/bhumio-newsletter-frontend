import { api } from '../../lib/api/client'
import type { List } from '../../types/list'

export const fetchLists = async (page: number, search: string) => {
  const res = await api.get('/lists', {
    params: { page, limit: 5, search },
  })
  return res.data
}

export const createList = async (name: string): Promise<List> => {
  const res = await api.post('/lists', { name })
  return res.data
}

export const updateList = async (id: string, name: string): Promise<List> => {
  const res = await api.put(`/lists/${id}`, { name })
  return res.data
}
