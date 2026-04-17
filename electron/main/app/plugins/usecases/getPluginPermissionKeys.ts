import { IPermissionRegistry } from '../application/ports/IPermissionRegistry'

export default class GetPluginPermissionKeys {
  constructor(private readonly permissionRegistry: IPermissionRegistry) {}

  async execute() {
    return this.permissionRegistry.getPermissionKeys()
  }
}
