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
]
