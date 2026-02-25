export type MediaEmbeddingProps = {
  mediaId: number
  embedding: number[]
  model: string
}

export type PersistedMediaEmbedding = MediaEmbeddingProps & {
  id: number
}

export class MediaEmbedding {
  private constructor(
    public readonly id: number | null,
    public readonly props: MediaEmbeddingProps,
  ) {}

  static create(props: MediaEmbeddingProps) {
    if (!props.mediaId) {
      throw new Error(`Media embedding must have a dedicated media`)
    }
    if (!props.embedding) {
      throw new Error(`Media embedding must contain an embedding`)
    }
    if (!props.model) {
      throw new Error(`Media embedding must provide the embedding model`)
    }
    const mediaEmbeddingProps: MediaEmbeddingProps = {
      mediaId: props.mediaId,
      embedding: props.embedding,
      model: props.model,
    }

    return new MediaEmbedding(null, mediaEmbeddingProps)
  }

  withId(id: number) {
    return new MediaEmbedding(id, this.props)
  }

  toDTO(): PersistedMediaEmbedding {
    if (this.id === null) {
      throw new Error(`Cannot convert unsaved MediaEmbedding to DTO`)
    }

    return {
      id: this.id,
      ...this.props,
    }
  }
}
