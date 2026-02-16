import { http, HttpResponse } from 'msw'
import { db } from './db'

export const subscriberHandlers = [
  http.post('/api/subscribers', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')
    const body = (await request.json()) as {
      email: string
      customFields?: Record<string, unknown>
    }

    if (!orgId) {
      return HttpResponse.json({ message: 'Org missing' }, { status: 400 })
    }

    const newSubscriber = {
      id: crypto.randomUUID(),
      email: body.email,
      organizationId: orgId,
      customFields: (body.customFields || {}) as Record<
        string,
        string | number | boolean | null
      >,
      gpgPublicKey: '',
      createdAt: new Date().toISOString(),
    }

    db.subscribers.push(newSubscriber)
    return HttpResponse.json(newSubscriber)
  }),

  http.get('/api/subscribers', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const limit = Number(url.searchParams.get('limit') || 5)
    const search = url.searchParams.get('search') || ''

    let subscribers = db.subscribers.filter((s) => s.organizationId === orgId)

    if (search) {
      subscribers = subscribers.filter((s) =>
        s.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    const total = subscribers.length
    const start = (page - 1) * limit
    const paginated = subscribers.slice(start, start + limit)

    return HttpResponse.json({
      data: paginated,
      total,
      page,
      limit,
    })
  }),

  http.put('/api/subscribers/:id', async ({ request, params }) => {
    const orgId = request.headers.get('x-org-id')
    const body = (await request.json()) as {
      email: string
      customFields?: Record<string, unknown>
    }

    const subscriber = db.subscribers.find(
      (s) => s.id === params.id && s.organizationId === orgId,
    )

    if (!subscriber) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }

    subscriber.email = body.email
    subscriber.customFields = (body.customFields || {}) as Record<
      string,
      string | number | boolean | null
    >

    return HttpResponse.json(subscriber)
  }),

  http.post('/api/gpg/upload', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')
    const body = (await request.json()) as {
      subscriberId: string
      gpgPublicKey: string
    }

    const subscriber = db.subscribers.find(
      (s) => s.id === body.subscriberId && s.organizationId === orgId,
    )

    if (!subscriber) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }

    subscriber.gpgPublicKey = body.gpgPublicKey
    return HttpResponse.json({ success: true })
  }),
]
