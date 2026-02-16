import { http, HttpResponse } from 'msw'
import { db } from './db'

export const templateHandlers = [
  http.post('/api/templates', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')
    const body = (await request.json()) as { name: string; content: string }

    const newTemplate = {
      id: crypto.randomUUID(),
      name: body.name,
      content: body.content,
      organizationId: orgId!,
      createdAt: new Date().toISOString(),
    }

    db.templates.push(newTemplate)
    return HttpResponse.json(newTemplate)
  }),

  http.get('/api/templates', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')

    const templates = db.templates.filter((t) => t.organizationId === orgId)

    return HttpResponse.json(templates)
  }),
]
