import { api } from '../../lib/api/client'
import type { Template } from '../../types/template'

export const createTemplate = async (data: {
  name: string
  content: string
}): Promise<Template> => {
  const res = await api.post('/templates', data)
  return res.data
}

export const fetchTemplates = async (): Promise<Template[]> => {
  const res = await api.get('/templates')
  return res.data
}
