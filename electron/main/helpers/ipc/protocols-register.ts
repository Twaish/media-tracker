import { net, protocol } from 'electron'
import { Modules } from './types'

function isRemoteUrl(path: string) {
  return path.startsWith('http://') || path.startsWith('https://')
}

export function registerProtocols({ StorageService }: Modules) {
  protocol.handle('images', function (request) {
    const url = new URL(request.url)
    const remoteUrl = url.searchParams.get('url')

    if (remoteUrl && isRemoteUrl(remoteUrl)) {
      return net.fetch(remoteUrl)
    }

    const imagePath = StorageService.resolve(url.hostname)
    return net.fetch(`file://${imagePath}`)
  })
}
