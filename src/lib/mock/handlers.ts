import { authHandlers } from './authHandlers'
import { orgHandlers } from './orgHandlers'
import { listHandlers } from './listHandlers'
import { subscriberHandlers } from './subscriberHandler'
import { campaignHandlers } from './campaignHandler'

export const handlers = [
  ...authHandlers,
  ...orgHandlers,
  ...listHandlers,
  ...subscriberHandlers,
  ...campaignHandlers,
]
