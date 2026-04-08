export const DeltaTypes = ['add', 'remove', 'update'] as const

export type DeltaProps = {
  type: (typeof DeltaTypes)[number]
  entity: string
  entityId: number
  before?: string | null
  after?: string | null
  createdAt?: Date
}

export type PersistedDelta = DeltaProps & {
  id: number
}

export class Delta {
  private constructor(
    public readonly id: number | null,
    public readonly props: DeltaProps,
  ) {}

  get type() {
    return this.props.type
  }

  get entity() {
    return this.props.entity
  }

  get entityId() {
    return this.props.entityId
  }

  get before() {
    if (this.props.type === 'add') return
    return this.props.before
  }

  get after() {
    if (this.props.type === 'remove') return
    return this.props.after
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: DeltaProps): Delta {
    const deltaProps: DeltaProps = {
      type: props.type,
      entity: props.entity,
      entityId: props.entityId,
      before: props.type !== 'add' ? props.before : (undefined as never),
      after: props.type !== 'remove' ? props.after : (undefined as never),
      createdAt: props.createdAt,
    }
    return new Delta(null, deltaProps)
  }

  withId(id: number) {
    return new Delta(id, this.props)
  }

  toDTO(): PersistedDelta {
    if (this.id === null) {
      throw new Error(`Cannot convert unsaved Delta to DTO`)
    }
    return {
      id: this.id,
      ...this.props,
    }
  }
}
