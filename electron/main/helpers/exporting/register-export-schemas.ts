import { Modules } from '../ipc/types'
import fs from 'fs/promises'
import path from 'path'

const at = <T, K>(path: T, callbacks: K[]) =>
  callbacks.map((callback) => ({ path, callback }))

const exporting = {
  v1: ({ StorageService }: Modules) =>
    [
      at('/', [
        async (dest: string) => {
          fs.writeFile(
            path.join(dest, 'manifest.json'),
            JSON.stringify({ exportedAt: new Date(), version: 1 }, null, 2),
          )
        },
      ]),
      at('assets/thumbnails', [
        (dest: string) => StorageService.exportImages(dest),
      ]),
    ].flat(),
}

export function registerExportSchemas(
  modules: Modules,
  version: keyof typeof exporting = 'v1',
) {
  const { ExportManager } = modules
  const schemas = exporting[version](modules)

  ExportManager.addExportSchemas(schemas)
}
