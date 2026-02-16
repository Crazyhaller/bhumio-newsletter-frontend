export type TriggerType = 'subscriber_added' | 'campaign_sent' | 'rss_new_item'

export type ActionType = 'send_campaign' | 'create_campaign_from_template'

export interface Automation {
  id: string
  name: string
  organizationId: string
  triggerType: TriggerType
  triggerConfig: any
  actionType: ActionType
  actionConfig: any
  createdAt: string
}

export interface RssFeed {
  id: string
  url: string
  organizationId: string
  lastChecked: string
}
