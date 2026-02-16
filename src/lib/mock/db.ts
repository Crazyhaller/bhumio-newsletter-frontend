import type { User, Organization } from '../../types/auth'
import type { List } from '../../types/list'

interface DB {
  users: User[]
  organizations: Organization[]
  lists: List[]
}

export const db: DB = {
  users: [],
  organizations: [],
  lists: [],
}
