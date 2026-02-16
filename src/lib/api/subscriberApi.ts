import { api } from '../../lib/api/client'
import type { Subscriber } from '../../types/subscriber'

export const fetchSubscribers = async (page: number, search: string) => {
  const res = await api.get('/subscribers', {
    params: { page, limit: 5, search },
  })
  return res.data
}

export const createSubscriber = async (data: {
  email: string
  customFields: Record<string, unknown>
}): Promise<Subscriber> => {
  const res = await api.post('/subscribers', data)
  return res.data
}

export const uploadGpgKey = async (
  subscriberId: string,
  gpgPublicKey: string,
) => {
  const res = await api.post('/gpg/upload', {
    subscriberId,
    gpgPublicKey,
  })
  return res.data
}
