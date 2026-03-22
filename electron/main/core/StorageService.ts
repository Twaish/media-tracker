import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import crypto from 'crypto'
import EventEmitter from 'events'
import { StoredImageResult, StoreImageOptions } from '@shared/types'

export class StorageService extends EventEmitter {
  dataPath: string
  fullPath: string
  basePath: string
  constructor(basePath: string, userDataPath: string) {
    super()
    this.dataPath = userDataPath
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
    const { maxWidth = 512, maxHeight = 512, format = 'png' } = options

    const { data, info } = await sharp(sourcePath)
      .rotate()
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .raw()
      .toBuffer({ resolveWithObject: true })

    const hash = crypto
      .createHash('sha256')
      .update(data)
      .update(`${info.width}x${info.height}x${info.channels}`)
      .digest('hex')

    const imageBuffer = await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    })
      .toFormat(format, { compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer()

    const filename = `${hash}.${format}`
    const fullPath = this.resolve(filename)

    if (!fs.existsSync(fullPath)) {
      await fs.promises.writeFile(fullPath, imageBuffer)
      this.emit('image-stored', fullPath)
    }

    return {
      hash,
      filename,
      fullPath,
      relativePath: path.join(this.basePath, filename),
      width: info.width!,
      height: info.height!,
      size: imageBuffer.length,
    }
  }

  async exportImages(destinationPath: string) {
    fs.mkdirSync(destinationPath, { recursive: true })

    const files = fs.readdirSync(this.fullPath)
    files.forEach((file) => {
      const src = path.join(this.fullPath, file)
      const dest = path.join(destinationPath, file)

      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest)
      }
    })
  }
}
