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

export const handlers = [
  http.post('/api/auth/login', async () => {
    return HttpResponse.json({ token: generateToken() })
  }),

  http.post('/api/users/register', async () => {
    return HttpResponse.json({ success: true })
  }),
]
