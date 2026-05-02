import { Modules } from '@/helpers/ipc/types'
import { os } from '@orpc/server'
import { createPluginsUseCases } from '../usecases'
import {
  disablePluginInputSchema,
  enablePluginInputSchema,
  getEntriesOutputSchema,
  getManifestInputSchema,
  getManifestOutputSchema,
  getManifestsOutputSchema,
  getPermissionKeysOutputSchema,
} from './schemas'

export function createPluginsRouters(modules: Modules) {
  const useCases = createPluginsUseCases(modules)

  return {
    getPermissionKeys: os
      .output(getPermissionKeysOutputSchema)
      .handler(() => useCases.getPluginPermissions.execute()),
    getManifests: os
      .output(getManifestsOutputSchema)
      .handler(() => useCases.getPluginManifests.execute()),
    getManifest: os
      .input(getManifestInputSchema)
      .output(getManifestOutputSchema)
      .handler(({ input }) => useCases.getPluginManifest.execute(input)),
    getEntries: os
      .output(getEntriesOutputSchema)
      .handler(() => useCases.getPluginEntries.execute()),
    disable: os
      .input(disablePluginInputSchema)
      .handler(({ input }) => useCases.disablePlugin.execute(input)),
    enable: os
      .input(enablePluginInputSchema)
      .handler(({ input }) => useCases.enablePlugin.execute(input)),
  }
}
