import { Action } from './Action'
import { BinaryExpression } from './Expression'

export type RuleNode = {
  type: 'rule'
  name: string
  trigger: string
  events: string[]
  target: string
  priority: number
  enabled: boolean
  condition: BinaryExpression
  execution: 'sequential'
  actions: Action[]
}
