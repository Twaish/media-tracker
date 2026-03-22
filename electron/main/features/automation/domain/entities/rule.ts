import { RuleNode } from '../ast/RuleNode'

export type RuleProps = {
  name: string
  target: string
  trigger: string
  events: string[]
  priority: number
  enabled: boolean
  source: string
  ast: RuleNode
  createdAt: Date | null
  lastUpdated: Date | null
}

export type PersistedRule = RuleProps & {
  id: number
}

export class Rule {
  private constructor(
    public readonly id: number | null,
    public readonly props: RuleProps,
  ) {}

  static create(props: RuleProps) {
    if (!props.name) {
      throw new Error(`Rule must have a name`)
    }

    return new Rule(null, {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      lastUpdated: props.lastUpdated ?? new Date(),
    })
  }

  withId(id: number) {
    return new Rule(id, this.props)
  }

  toDTO(): PersistedRule {
    if (!this.id) {
      throw new Error(`Cannot convert unsaved Rule to DTO`)
    }

    return {
      id: this.id,
      ...this.props,
    }
  }

  get name() {
    return this.props.name
  }

  get target() {
    return this.props.target
  }

  get trigger() {
    return this.props.trigger
  }

  get events() {
    return this.props.events
  }

  get priority() {
    return this.props.priority
  }

  get enabled() {
    return this.props.enabled
  }

  get source() {
    return this.props.source
  }

  get ast() {
    return this.props.ast
  }

  get createdAt() {
    return this.props.createdAt
  }

  get lastUpdated() {
    return this.props.lastUpdated
  }
}
