import { MediaProgress } from '../entities/mediaProgress'

export interface IMediaProgressRepository {
  add(mediaProgress: MediaProgress): Promise<MediaProgress>
  getByMediaId(mediaId: number): Promise<MediaProgress[]>
}
