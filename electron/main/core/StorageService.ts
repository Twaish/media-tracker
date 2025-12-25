import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import crypto from 'crypto'

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
  width: number
  height: number
  size: number
}

export default class StorageService {
  basePath: string
  constructor(basePath: string) {
    const userDataPath = app.getPath('userData')
    this.basePath = path.join(userDataPath, basePath)
    fs.mkdirSync(this.basePath, { recursive: true })
  }
  resolve(relativePath: string) {
    return path.join(this.basePath, relativePath)
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
        console.log('Wrote file ' + fullPath)
      })
    }

    const metadata = await sharp(resizedBuffer).metadata()

    return {
      hash,
      filename,
      fullPath,
      width: metadata.width!,
      height: metadata.height!,
      size: resizedBuffer.length,
    }
  }
}
