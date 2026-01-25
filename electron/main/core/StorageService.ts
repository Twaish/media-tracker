import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import crypto from 'crypto'
import EventEmitter from 'events'

type StoreImageOptions = {
  maxWidth?: number
  maxHeight?: number
  format?: 'webp' | 'png' | 'jpeg'
  quality?: number
}

type StoredImageResult = {
  hash: string
  filename: string
  fullPath: string
  relativePath: string
  width: number
  height: number
  size: number
}

export class StorageService extends EventEmitter {
  dataPath: string
  fullPath: string
  basePath: string
  constructor(basePath: string) {
    super()
    this.dataPath = app.getPath('userData')
    this.fullPath = path.join(this.dataPath, basePath)
    this.basePath = basePath
    fs.mkdirSync(this.fullPath, { recursive: true })
  }
  resolve(relativePath: string) {
    return path.join(this.fullPath, relativePath)
  }

  async storeImage(
    sourcePath: string,
    options: StoreImageOptions = {},
  ): Promise<StoredImageResult> {
    const {
      // maxWidth = 512,
      maxHeight = 512,
      format = 'webp',
      quality = 80,
    } = options

    const image = sharp(sourcePath).rotate()

    const resizedBuffer = await image
      .resize({
        // width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(format, { quality })
      .toBuffer()

    const hash = crypto.createHash('sha256').update(resizedBuffer).digest('hex')

    const filename = `${hash}.${format}`
    const fullPath = this.resolve(filename)

    if (!fs.existsSync(fullPath)) {
      fs.writeFile(fullPath, resizedBuffer, (err) => {
        if (err) throw err
        this.emit('image-stored', fullPath)
      })
    }

    const metadata = await sharp(resizedBuffer).metadata()

    return {
      hash,
      filename,
      fullPath,
      relativePath: path.join(this.basePath, filename),
      width: metadata.width!,
      height: metadata.height!,
      size: resizedBuffer.length,
    }
  }
}
