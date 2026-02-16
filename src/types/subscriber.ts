export interface Subscriber {
  id: string
  email: string
  organization_id: string
  custom_fields: Record<string, string>
  gpg_public_key?: string
  created_at: string
}

export interface PaginatedSubscribers {
  data: Subscriber[]
  total: number
  page: number
  limit: number
}
