import { os } from '@orpc/server'
import { Modules } from '@/helpers/ipc/types'
import { nameOutputSchema, versionOutputSchema } from './schemas'

export function createInstanceRouters({ appInfo }: Modules) {
  return {
    name: os.output(nameOutputSchema).handler(() => appInfo.name),
    version: os.output(versionOutputSchema).handler(() => appInfo.version),
  }
}
