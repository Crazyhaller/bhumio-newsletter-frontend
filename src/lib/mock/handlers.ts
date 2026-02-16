import { authHandlers } from './authHandlers'
import { orgHandlers } from './orgHandlers'
import { listHandlers } from './listHandlers'
import { subscriberHandlers } from './subscriberHandler'

export const handlers = [
  ...authHandlers,
  ...orgHandlers,
  ...listHandlers,
  ...subscriberHandlers,
]
