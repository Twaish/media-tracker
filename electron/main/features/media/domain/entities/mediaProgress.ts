export type MediaProgressProps = {
  mediaId: number
  progress: number
  previousProgress?: number | null
  createdAt?: Date | null
}

export type PersistedMediaProgress = MediaProgressProps & {
  id: number
}

export class MediaProgress {
  private constructor(
    public readonly id: number | null,
    public readonly props: MediaProgressProps,
  ) {}

  get mediaId() {
    return this.props.mediaId
  }

  get progress() {
    return this.props.progress
  }

  get previousProgress() {
    return this.props.previousProgress
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: MediaProgressProps) {
    if (!props.mediaId) {
      throw new Error(`Media progress must have a dedicated media`)
    }
    if (!props.progress) {
      throw new Error(`Media progress must have progress`)
    }
    const mediaProgressProps: MediaProgressProps = {
      mediaId: props.mediaId,
      progress: props.progress,
      previousProgress: props.previousProgress,
      createdAt: props.createdAt,
    }

    return new MediaProgress(null, mediaProgressProps)
  }

  withId(id: number) {
    return new MediaProgress(id, this.props)
  }

  toDTO(): PersistedMediaProgress {
    if (this.id === null) {
      throw new Error(`Cannot convert unsaved MediaProgress to DTO`)
    }

    return {
      id: this.id,
      ...this.props,
    }
  }
}
