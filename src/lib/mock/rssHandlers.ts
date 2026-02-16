import { http, HttpResponse } from 'msw'
import { db } from './db'

export const rssHandlers = [
  http.post('/api/rss', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')
    const body = (await request.json()) as { url: string }

    const feed = {
      id: crypto.randomUUID(),
      url: body.url,
      organizationId: orgId!,
      lastChecked: new Date().toISOString(),
    }

    db.rssFeeds.push(feed)
    return HttpResponse.json(feed)
  }),

  http.post('/api/rss/check', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')

    // Simulate RSS new item
    const automations = db.automations.filter(
      (a) => a.organizationId === orgId && a.triggerType === 'rss_new_item',
    )

    automations.forEach((automation) => {
      db.campaigns.push({
        id: crypto.randomUUID(),
        subject: 'RSS Auto Campaign',
        content: '<h1>New RSS Content</h1>',
        listId: automation.actionConfig.listId,
        organizationId: orgId!,
        createdAt: new Date().toISOString(),
        sent: true,
      })
    })

    return HttpResponse.json({ triggered: automations.length })
  }),
]
