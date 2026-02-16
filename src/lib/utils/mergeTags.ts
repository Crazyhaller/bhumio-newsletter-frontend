import type { Subscriber } from '../../types/subscriber'

export const applyMergeTags = (html: string, subscriber: Subscriber) => {
  let result = html

  result = result.replace(/{{email}}/g, subscriber.email)

  Object.entries(subscriber.customFields).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, String(value))
  })

  return result
}
