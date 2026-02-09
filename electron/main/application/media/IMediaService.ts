export interface IMediaService {
  resolveExternalUrl(mediaId: number, index: number): Promise<string | null>
}
