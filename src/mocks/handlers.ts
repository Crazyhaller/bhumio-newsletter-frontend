import { http, HttpResponse } from 'msw'

function generateToken() {
  return btoa(
    JSON.stringify({
      userId: '1',
      organizationId: 'org-123',
      role: 'Admin',
    }),
  )
}

let organizations = [
  {
    id: '1',
    name: 'Default Org',
    created_at: new Date().toISOString(),
  },
]

let subscribers = Array.from({ length: 35 }).map((_, i) => ({
  id: crypto.randomUUID(),
  email: `user${i}@mail.com`,
  organization_id: 'org-123',
  custom_fields: { firstName: `User${i}` },
  created_at: new Date().toISOString(),
}))

export const handlers = [
  http.post('/api/auth/login', async () => {
    return HttpResponse.json({ token: generateToken() })
  }),

  http.post('/api/users/register', async () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/organizations', () => {
    return HttpResponse.json(organizations)
  }),

  http.post('/api/organizations', async ({ request }) => {
    const body = (await request.json()) as { name: string }

    const newOrg = {
      id: crypto.randomUUID(),
      name: body?.name,
      created_at: new Date().toISOString(),
    }

    organizations.push(newOrg)

    return HttpResponse.json(newOrg)
  }),

  http.get('/api/subscribers', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const limit = Number(url.searchParams.get('limit') || 10)
    const search = url.searchParams.get('search') || ''

    let filtered = subscribers.filter((s) =>
      s.email.toLowerCase().includes(search.toLowerCase()),
    )

    const start = (page - 1) * limit
    const paginated = filtered.slice(start, start + limit)

    return HttpResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      limit,
    })
  }),

  http.post('/api/subscribers', async ({ request }) => {
    const body = (await request.json()) as {
      email: string
      custom_fields?: { firstName?: string }
    }

    const newSub = {
      id: crypto.randomUUID(),
      email: body.email,
      organization_id: 'org-123',
      custom_fields: { firstName: body.custom_fields?.firstName || '' },
      created_at: new Date().toISOString(),
    }

    subscribers.push(newSub)
    return HttpResponse.json(newSub)
  }),

  http.put('/api/subscribers/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as {
      email: string
      custom_fields?: { firstName?: string }
    }

    subscribers = subscribers.map((s) =>
      s.id === id
        ? {
            ...s,
            email: body.email,
            custom_fields: { firstName: body.custom_fields?.firstName || '' },
          }
        : s,
    )

    return HttpResponse.json({ success: true })
  }),
]
