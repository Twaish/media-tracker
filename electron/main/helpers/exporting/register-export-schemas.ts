import { Modules } from '../ipc/types'
import fs from 'fs/promises'
import path from 'path'

export function registerExportSchemas(modules: Modules) {
  const { ExportManager, StorageService } = modules

  const at = <T, K>(path: T, callbacks: K[]) =>
    callbacks.map((callback) => ({ path, callback }))

  ExportManager.addExportSchemas(
    [
      at('/', [
        async (dest: string) => {
          fs.writeFile(
            path.join(dest, 'manifest.json'),
            JSON.stringify({ exportedAt: new Date() }, null, 2),
          )
        },
      ]),
      at('assets/thumbnails', [
        (dest: string) => StorageService.exportImages(dest),
      ]),
    ].flat(),
  )
}
