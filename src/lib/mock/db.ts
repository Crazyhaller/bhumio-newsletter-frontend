import type { User, Organization } from '../../types/auth'
import type { List } from '../../types/list'
import type { Subscriber } from '../../types/subscriber'

interface DB {
  users: User[]
  organizations: Organization[]
  lists: List[]
  subscribers: Subscriber[]
}

export const db: DB = {
  users: [],
  organizations: [],
  lists: [],
  subscribers: [],
}
