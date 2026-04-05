import { IPermissionRegistry } from '@/app/plugins/application/ports/IPermissionRegistry'
import { Modules } from './ipc/types'

export function registerPluginPermissions(
  modules: Modules,
  permissionRegistry: IPermissionRegistry,
) {
  permissionRegistry.setBaseContext({
    logger: modules.logger,
    appInfo: modules.appInfo,
  })
  permissionRegistry.register('events:subscribe', {
    events: {
      subscribe: modules.EventBus.subscribe.bind(modules.EventBus),
    },
  })
  permissionRegistry.register('events:emit', {
    events: {
      emit: modules.EventBus.publish.bind(modules.EventBus),
    },
  })
}
