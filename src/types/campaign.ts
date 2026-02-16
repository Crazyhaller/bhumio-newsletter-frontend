export interface Campaign {
  id: string
  subject: string
  content: string
  listId: string
  organizationId: string
  createdAt: string
  sent?: boolean
}

export interface ClickStat {
  id: string
  campaignId: string
  link: string
  clickCount: number
  createdAt: string
}
