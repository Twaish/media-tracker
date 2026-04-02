import { TemplateNode } from '../ast/TemplateNode'

export type TemplateProps = {
  name: string
  source: string
  ast: TemplateNode
  createdAt?: Date | null
  lastUpdated?: Date | null
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
