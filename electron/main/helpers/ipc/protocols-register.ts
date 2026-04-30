import { net, protocol } from 'electron'
import { pathToFileURL } from 'url'

function isRemoteUrl(path: string) {
  return path.startsWith('http://') || path.startsWith('https://')
}

const createProtocolHandler =
  ({
    resolve,
    validate,
    toFetchUrl = (v) => pathToFileURL(v).toString(),
  }: {
    resolve: (url: URL) => string | null
    validate?: (url: URL) => boolean
    toFetchUrl?: (resolved: string) => string
  }) =>
  (request: Request) => {
    const url = new URL(request.url)
    if (validate && !validate(url)) {
      return new Response('Bad Request', { status: 400 })
    }

    const resolved = resolve(url)
    if (!resolved) {
      throw new Response('Forbidden', { status: 403 })
    }

    return net.fetch(toFetchUrl(resolved))
  }

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'images',
    privileges: { secure: true, standard: true, supportFetchAPI: true },
  },
  {
    scheme: 'themeicon',
    privileges: { secure: true, standard: true, supportFetchAPI: true },
  },
  {
    scheme: 'remoteimage',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
])

export function registerProtocols({
  resolveMediaThumbnail,
  resolveThemeIcon,
}: {
  resolveMediaThumbnail: (path: string) => string | null
  resolveThemeIcon: (path: string) => string | null
}) {
  protocol.handle(
    'images',
    createProtocolHandler({
      resolve: (url) => resolveMediaThumbnail(url.hostname),
    }),
  )
  protocol.handle(
    'themeicon',
    createProtocolHandler({
      resolve: (url) => resolveThemeIcon(url.hostname),
    }),
  )
  protocol.handle(
    'remoteimage',
    createProtocolHandler({
      validate: (url) => {
        const remoteUrl = url.searchParams.get('url')
        return !!remoteUrl && isRemoteUrl(remoteUrl)
      },
      resolve: (url) => url.searchParams.get('url'),
      toFetchUrl: (url) => url,
    }),
  )
}
