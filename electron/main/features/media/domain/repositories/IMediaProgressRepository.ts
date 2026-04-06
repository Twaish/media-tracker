import {
  MediaProgress,
  PersistedMediaProgress,
} from '../entities/mediaProgress'

export interface IMediaProgressRepository {
  add(mediaProgress: MediaProgress): Promise<PersistedMediaProgress>
  getByMediaId(mediaId: number): Promise<PersistedMediaProgress[]>
}
