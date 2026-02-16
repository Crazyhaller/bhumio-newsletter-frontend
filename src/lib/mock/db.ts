import type { User, Organization } from '../../types/auth'
import type { Campaign, ClickStat } from '../../types/campaign'
import type { List } from '../../types/list'
import type { Subscriber } from '../../types/subscriber'
import type { Template } from '../../types/template'
import type { Automation, RssFeed } from '../../types/automation'

interface DB {
  users: User[]
  organizations: Organization[]
  lists: List[]
  subscribers: Subscriber[]
  campaigns: Campaign[]
  clickStats: ClickStat[]
  templates: Template[]
  automations: Automation[]
  rssFeeds: RssFeed[]
}

export const db: DB = {
  users: [],
  organizations: [],
  lists: [],
  subscribers: [],
  campaigns: [],
  clickStats: [],
  templates: [],
  automations: [],
  rssFeeds: [],
}
