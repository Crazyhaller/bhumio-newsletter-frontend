import type { User, Organization } from '../../types/auth'

interface DB {
  users: User[]
  organizations: Organization[]
}

export const db: DB = {
  users: [],
  organizations: [],
}
