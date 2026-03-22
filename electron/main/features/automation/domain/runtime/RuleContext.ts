import { EntityEvent } from '../runtime/EntityEvent'

export type RuleContext<T> = EntityEvent<T> & {
  activeRules: Set<string>
}
