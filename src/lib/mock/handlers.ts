import { authHandlers } from './authHandlers'
import { orgHandlers } from './orgHandlers'
import { listHandlers } from './listHandlers'
import { subscriberHandlers } from './subscriberHandler'
import { campaignHandlers } from './campaignHandler'
import { templateHandlers } from './templateHandlers'

export const handlers = [
  ...authHandlers,
  ...orgHandlers,
  ...listHandlers,
  ...subscriberHandlers,
  ...campaignHandlers,
  ...templateHandlers,
]
