import { shell } from 'electron'
import fs from 'fs'
import { os } from '@orpc/server'
import { Modules } from '@/helpers/ipc/types'
import {
  nameOutputSchema,
  openFolderInputSchema,
  openLinkInputSchema,
  versionOutputSchema,
} from './schemas'

export function createInstanceRouters({ appInfo }: Modules) {
  return {
    name: os.output(nameOutputSchema).handler(() => appInfo.name),
    version: os.output(versionOutputSchema).handler(() => appInfo.version),
    openFolder: os.input(openFolderInputSchema).handler(({ input }) => {
      if (fs.existsSync(input)) {
        shell.openPath(input)
      }
    }),
    openLink: os.input(openLinkInputSchema).handler(({ input }) => {
      shell.openExternal(input)
    }),
  }
}
