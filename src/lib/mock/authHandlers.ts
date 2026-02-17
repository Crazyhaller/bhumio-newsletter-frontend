import { http, HttpResponse } from 'msw'
import { db } from './db'
import type { AuthResponse } from '../../types/auth'

export const authHandlers = [
  http.post('/api/users/register', async ({ request }) => {
    const body = (await request.json()) as { email: string } & {
      password: string
    } & { organizationName: string }

    const existing = db.users.find((u) => u.email === body.email)
    if (existing) {
      return HttpResponse.json(
        { message: 'User already exists' },
        { status: 400 },
      )
    }

    const newOrg = {
      id: crypto.randomUUID(),
      name: body.organizationName,
      createdAt: new Date().toISOString(),
    }

    db.organizations.push(newOrg)

    const newUser = {
      id: crypto.randomUUID(),
      email: body.email,
      organizationId: newOrg.id,
      role: 'Superadmin' as const,
    }

    db.users.push(newUser)

    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: newUser,
    })
  }),

  http.post('/api/users/login', async ({ request }) => {
    const body = (await request.json()) as { email: string }

    const user = db.users.find((u) => u.email === body.email)

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
      )
    }

    const response: AuthResponse = {
      token: 'mock-jwt-token',
      user,
    }

    return HttpResponse.json(response)
  }),
]
