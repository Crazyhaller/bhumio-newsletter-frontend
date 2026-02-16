import type { User } from '../../types/auth'

interface DB {
  users: User[]
}

export const db: DB = {
  users: [],
}
