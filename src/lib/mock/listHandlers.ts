import { http, HttpResponse } from 'msw'
import { db } from './db'

export const listHandlers = [
  // Create List
  http.post('/api/lists', async ({ request }) => {
    const body = (await request.json()) as { name: string }
    const orgId = request.headers.get('x-org-id')

    if (!orgId) {
      return HttpResponse.json(
        { message: 'Organization header missing' },
        { status: 400 },
      )
    }

    const newList = {
      id: crypto.randomUUID(),
      name: body.name,
      organizationId: orgId,
      customFields: {},
      createdAt: new Date().toISOString(),
    }

    db.lists.push(newList)

    return HttpResponse.json(newList)
  }),

  // Get Lists (Paginated + Org Scoped)
  http.get('/api/lists', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const limit = Number(url.searchParams.get('limit') || 5)
    const search = url.searchParams.get('search') || ''

    if (!orgId) {
      return HttpResponse.json(
        { message: 'Organization header missing' },
        { status: 400 },
      )
    }

    let lists = db.lists.filter((l) => l.organizationId === orgId)

    if (search) {
      lists = lists.filter((l) =>
        l.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    const total = lists.length
    const start = (page - 1) * limit
    const paginated = lists.slice(start, start + limit)

    return HttpResponse.json({
      data: paginated,
      total,
      page,
      limit,
    })
  }),

  // Update List
  http.put('/api/lists/:id', async ({ request, params }) => {
    const orgId = request.headers.get('x-org-id')

    const list = db.lists.find(
      (l) => l.id === params.id && l.organizationId === orgId,
    )

    if (!list) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }

    const body = (await request.json()) as { name: string }
    list.name = body.name

    return HttpResponse.json(list)
  }),
]
