import { http, HttpResponse } from 'msw'
import { db } from './db'

export const campaignHandlers = [
  // Create Campaign
  http.post('/api/campaigns', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')
    const body = (await request.json()) as {
      subject: string
      content: string
      listId: string
    }

    const newCampaign = {
      id: crypto.randomUUID(),
      subject: body.subject,
      content: body.content,
      listId: body.listId,
      organizationId: orgId!,
      createdAt: new Date().toISOString(),
      sent: false,
    }

    db.campaigns.push(newCampaign)
    return HttpResponse.json(newCampaign)
  }),

  // Get Campaigns
  http.get('/api/campaigns', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')

    const campaigns = db.campaigns.filter((c) => c.organizationId === orgId)

    return HttpResponse.json(campaigns)
  }),

  // Send Campaign
  http.post('/api/campaigns/:id/send', async ({ request, params }) => {
    const orgId = request.headers.get('x-org-id')

    const campaign = db.campaigns.find(
      (c) => c.id === params.id && c.organizationId === orgId,
    )

    if (!campaign) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }

    campaign.sent = true

    // Simulate click stats generation
    const links = extractLinks(campaign.content)

    links.forEach((link) => {
      db.clickStats.push({
        id: crypto.randomUUID(),
        campaignId: campaign.id,
        link,
        clickCount: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
      })
    })

    return HttpResponse.json({ success: true })
  }),

  // Click Stats
  http.get('/api/campaigns/:id/click-stats', async ({ request, params }) => {
    const orgId = request.headers.get('x-org-id')

    const stats = db.clickStats.filter((s) => {
      const campaign = db.campaigns.find((c) => c.id === s.campaignId)
      return campaign?.organizationId === orgId && s.campaignId === params.id
    })

    return HttpResponse.json(stats)
  }),
]

// Utility
function extractLinks(content: string) {
  const regex = /(https?:\/\/[^\s"]+)/g
  return content.match(regex) || []
}
