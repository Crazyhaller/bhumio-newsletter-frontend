import { http, HttpResponse } from 'msw'
import { db } from './db'

export const orgHandlers = [
  http.get('/api/organizations', async () => {
    return HttpResponse.json(db.organizations)
  }),

  http.post('/api/organizations', async ({ request }) => {
    const body = (await request.json()) as { name: string }

    const newOrg = {
      id: crypto.randomUUID(),
      name: body.name,
      createdAt: new Date().toISOString(),
    }

    db.organizations.push(newOrg)

    return HttpResponse.json(newOrg)
  }),
]
