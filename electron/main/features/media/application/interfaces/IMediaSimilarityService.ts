import { MediaProps } from '../../domain/entities/media'

export interface IMediaSimilarityService {
  findTopKSimilarByMedia(
    mediaId: number,
    model: string,
    k?: number,
    threshold?: number,
  ): Promise<{ item: number; score: number }[]>
  findTopKSimilar(
    inputText: string,
    model: string,
    k?: number,
    threshold?: number,
  ): Promise<{ item: number; score: number }[]>
  buildText(media: Partial<MediaProps>): string
}
