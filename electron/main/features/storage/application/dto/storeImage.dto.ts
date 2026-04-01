export type StoreImageDTO = {
  imagePath: string
  options?: {
    maxWidth?: number
    maxHeight?: number
    format?: 'webp' | 'png' | 'jpeg'
    quality?: number
  }
}
