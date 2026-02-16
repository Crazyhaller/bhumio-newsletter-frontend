import { authHandlers } from './authHandlers'
import { orgHandlers } from './orgHandlers'
import { listHandlers } from './listHandlers'

export const handlers = [...authHandlers, ...orgHandlers, ...listHandlers]
