import { api } from '../../lib/api/client'
import type { Campaign, ClickStat } from '../../types/campaign'

export const createCampaign = async (data: any): Promise<Campaign> => {
  const res = await api.post('/campaigns', data)
  return res.data
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const res = await api.get('/campaigns')
  return res.data
}

export const sendCampaign = async (id: string) => {
  const res = await api.post(`/campaigns/${id}/send`)
  return res.data
}

export const fetchClickStats = async (id: string): Promise<ClickStat[]> => {
  const res = await api.get(`/campaigns/${id}/click-stats`)
  return res.data
}
