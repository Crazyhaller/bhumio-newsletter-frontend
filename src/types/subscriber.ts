export interface Subscriber {
  id: string
  email: string
  organizationId: string
  customFields: Record<string, string | number | boolean | null>
  gpgPublicKey?: string
  createdAt: string
}

export interface CreateSubscriberDTO {
  email: string
  customFields: Record<string, string | number | boolean | null>
}
