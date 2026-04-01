export type WatchPlanProps = {
  name: string
  segments: WatchPlanSegmentProps[]
  createdAt: Date | null
}

export type PersistedWatchPlan = WatchPlanProps & {
  id: number
}

export class WatchPlan {
  private constructor(
    public readonly id: number | null,
    public readonly props: WatchPlanProps,
  ) {}

  static create(props: WatchPlanProps) {
    if (!props.name) {
      throw new Error(`Watch plan must have a name`)
    }
    if (props.segments.length === 0) {
      throw new Error('Watch plan must contain at least one segment')
    }
    const watchPlanProps: WatchPlanProps = {
      name: props.name,
      segments: props.segments,
      createdAt: props.createdAt ?? new Date(),
    }

    return new WatchPlan(null, watchPlanProps)
  }

  withId(id: number) {
    return new WatchPlan(id, this.props)
  }

  toDTO(): PersistedWatchPlan {
    if (this.id === null) {
      throw new Error(`Cannot convert unsaved WatchPlan to DTO`)
    }

    return {
      id: this.id,
      ...this.props,
    }
  }

  get name() {
    return this.props.name
  }
  get segments() {
    return this.props.segments
  }
  get createdAt() {
    return this.props.createdAt
  }
}

export type WatchPlanSegmentProps = {
  mediaId: number
  startEpisode: number
  endEpisode: number
  order?: number
}

export type PersistedWatchPlanSegment = WatchPlanSegmentProps & {
  id: number
}

export class WatchPlanSegment {
  private constructor(
    public readonly id: number | null,
    public readonly props: WatchPlanSegmentProps,
  ) {}

  static create(props: WatchPlanSegmentProps) {
    if (!props.mediaId) {
      throw new Error('Watch plan segment must have a media')
    }
    if (props.startEpisode <= 0 || props.endEpisode < props.startEpisode) {
      throw new Error('Invalid episode range')
    }
    const watchPlanSegmentProps: WatchPlanSegmentProps = {
      mediaId: props.mediaId,
      startEpisode: props.startEpisode,
      endEpisode: props.endEpisode,
      order: props.order,
    }

    return new WatchPlanSegment(null, watchPlanSegmentProps)
  }

  withId(id: number) {
    return new WatchPlanSegment(id, this.props)
  }

  toDTO(): PersistedWatchPlanSegment {
    if (this.id === null) {
      throw new Error(`Cannot convert unsaved WatchPlanSegmet to DTO`)
    }

    return {
      id: this.id,
      ...this.props,
    }
  }

  get mediaId() {
    return this.props.mediaId
  }
  get startEpisode() {
    return this.props.startEpisode
  }
  get endEpisode() {
    return this.props.endEpisode
  }
  get order() {
    return this.props.order
  }
}
