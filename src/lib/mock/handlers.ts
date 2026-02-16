import { authHandlers } from './authHandlers'
import { orgHandlers } from './orgHandlers'

export const handlers = [...authHandlers, ...orgHandlers]
