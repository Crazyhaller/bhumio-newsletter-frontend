export interface List {
  id: string
  name: string
  organizationId: string
  customFields: Record<string, string | number | boolean | null>
  createdAt: string
}

export interface CreateListDTO {
  name: string
}
