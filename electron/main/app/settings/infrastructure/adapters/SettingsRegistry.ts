import {
  RuntimeSchema,
  SettingsInterface,
} from '../../application/ports/ISettingsBuilder'
import { ISettingsRegistry } from '../../application/ports/ISettingsRegistry'

export class SettingsRegistry implements ISettingsRegistry {
  private providers = new Map<string, SettingsInterface>()

  private getProvider(namespace: string): SettingsInterface {
    const provider = this.providers.get(namespace)
    if (!provider) {
      throw new Error(`No provider for namespace ${namespace}`)
    }
    return provider
  }

  register(namespace: string, provider: SettingsInterface): void {
    this.providers.set(namespace, provider)
  }

  get(
    namespace: string,
    key: keyof RuntimeSchema,
  ): RuntimeSchema[keyof RuntimeSchema] {
    const provider = this.getProvider(namespace)
    return provider.get(key)
  }

  getSecret(namespace: string, key: string): string {
    function isString(value: unknown): value is string {
      return typeof value === 'string'
    }

    const value = this.get(namespace, key)

    if (!isString(value)) {
      throw new Error(`Secret value must be a string value`)
    }

    return value
  }
}
