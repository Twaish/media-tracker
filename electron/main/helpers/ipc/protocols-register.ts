import { net, protocol } from 'electron'
import { Modules } from './types'

export default function registerProtocols({ StorageService }: Modules) {
  protocol.handle('images', function (request) {
    const imagePath = StorageService.resolve(
      request.url.slice('images://'.length),
    )
    return net.fetch(`file://${imagePath}`)
  })
}
