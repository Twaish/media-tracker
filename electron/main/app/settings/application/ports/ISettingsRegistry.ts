import { RuntimeSchema, SettingsInterface } from './ISettingsBuilder'

export interface ISettingsRegistry {
  register(namespace: string, provider: SettingsInterface): void

  get(
    namespace: string,
    key: keyof RuntimeSchema,
  ): RuntimeSchema[keyof RuntimeSchema]

  getSecret(namespace: string, key: string): string

  flushAll(): Promise<void>
}
