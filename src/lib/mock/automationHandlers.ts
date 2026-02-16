import { http, HttpResponse } from 'msw'
import { db } from './db'
import type { ActionType, TriggerType } from '../../types/automation'

export const automationHandlers = [
  // Create Automation
  http.post('/api/automations', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')
    const body = (await request.json()) as {
      name: string
      triggerType: string
      triggerConfig: any
      actionType: ActionType
      actionConfig: any
    }

    const automation = {
      id: crypto.randomUUID(),
      name: body.name,
      organizationId: orgId!,
      triggerType: body.triggerType as TriggerType,
      triggerConfig: body.triggerConfig,
      actionType: body.actionType,
      actionConfig: body.actionConfig,
      createdAt: new Date().toISOString(),
    }

    db.automations.push(automation)
    return HttpResponse.json(automation)
  }),

  // Get Automations
  http.get('/api/automations', async ({ request }) => {
    const orgId = request.headers.get('x-org-id')
    return HttpResponse.json(
      db.automations.filter((a) => a.organizationId === orgId),
    )
  }),
]
