import { RuleNode, TemplateNode } from '../automation/types'

export type RuleProps = {
  name: string
  target: string
  trigger: string
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

export type TemplateProps = {
  name: string
  source: string
  ast: TemplateNode
  createdAt: Date | null
  lastUpdated: Date | null
}

export type PersistedTemplate = TemplateProps & {
  id: number
}

export class Template {
  private constructor(
    public readonly id: number | null,
    public readonly props: TemplateProps,
  ) {}

  static create(props: TemplateProps) {
    if (!props.name) {
      throw new Error(`Template must have a name`)
    }

    return new Template(null, {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      lastUpdated: props.lastUpdated ?? new Date(),
    })
  }

  withId(id: number) {
    return new Template(id, this.props)
  }

  toDTO(): PersistedTemplate {
    if (!this.id) {
      throw new Error(`Cannot convert unsaved Template to DTO`)
    }

    return {
      id: this.id,
      ...this.props,
    }
  }

  get name() {
    return this.props.name
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
