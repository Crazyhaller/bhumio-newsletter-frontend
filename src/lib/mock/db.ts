import type { User, Organization } from '../../types/auth'
import type { Campaign, ClickStat } from '../../types/campaign'
import type { List } from '../../types/list'
import type { Subscriber } from '../../types/subscriber'

interface DB {
  users: User[]
  organizations: Organization[]
  lists: List[]
  subscribers: Subscriber[]
  campaigns: Campaign[]
  clickStats: ClickStat[]
}

export const db: DB = {
  users: [],
  organizations: [],
  lists: [],
  subscribers: [],
  campaigns: [],
  clickStats: [],
}
