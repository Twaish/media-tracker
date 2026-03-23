export type StoreImageOptions = {
  maxWidth?: number
  maxHeight?: number
  format?: 'webp' | 'png' | 'jpeg'
  quality?: number
}

export type StoredImageResult = {
  hash: string
  filename: string
  fullPath: string
  relativePath: string
  width: number
  height: number
  size: number
}

export interface StorageContext {
  storeImage(
    imagePath: string,
    options: StoreImageOptions,
  ): Promise<StoredImageResult>
  exportImages(destinationPath: string): Promise<void>
}
