import { api } from '../../lib/api/client'
import type { Automation } from '../../types/automation'

export const createAutomation = async (data: any): Promise<Automation> => {
  const res = await api.post('/automations', data)
  return res.data
}

export const fetchAutomations = async (): Promise<Automation[]> => {
  const res = await api.get('/automations')
  return res.data
}

export const checkRssFeeds = async () => {
  const res = await api.post('/rss/check')
  return res.data
}
