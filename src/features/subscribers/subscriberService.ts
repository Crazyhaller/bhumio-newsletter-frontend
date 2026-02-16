import api from '../../services/axios'
import type { PaginatedSubscribers } from '../../types/subscriber'

export const getSubscribers = async (
  page: number,
  limit: number,
  search: string,
): Promise<PaginatedSubscribers> => {
  const res = await api.get('/subscribers', {
    params: { page, limit, search },
  })
  return res.data
}

export const createSubscriber = async (data: any) => {
  const res = await api.post('/subscribers', data)
  return res.data
}
