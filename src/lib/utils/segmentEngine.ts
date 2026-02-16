import type { Subscriber } from '../../types/subscriber'

export interface Rule {
  field: string
  operator: 'equals' | 'contains'
  value: string
}

export const applySegmentation = (subscribers: Subscriber[], rules: Rule[]) => {
  return subscribers.filter((sub) =>
    rules.every((rule) => {
      const fieldValue =
        rule.field === 'email' ? sub.email : sub.customFields[rule.field]

      if (!fieldValue) return false

      if (rule.operator === 'equals') return fieldValue === rule.value

      if (rule.operator === 'contains')
        return String(fieldValue).includes(rule.value)

      return false
    }),
  )
}
