import {
  ISettingsBuilder,
  OnDiskSchema,
  OnDiskValue,
  RuntimeSchema,
  Schema,
} from '../../application/ports/ISettingsBuilder'
import { ISettingsRegistry } from '../../application/ports/ISettingsRegistry'
import { JsonStore } from '@/core/JsonStore'

type SettingsBuilderOptions = {
  store: JsonStore
  encrypt: (value: string) => string
  decrypt: (value: string) => string
}

export class SettingsBuilder implements ISettingsBuilder {
  constructor(
    private readonly options: SettingsBuilderOptions,
    private readonly registry: ISettingsRegistry,
  ) {}

  defineSettings<T extends Schema>(
    namespace: string,
    filename: string,
    schema: T,
  ) {
    const { store, encrypt, decrypt } = this.options

    let cache: RuntimeSchema<T> | null = null

    async function load(): Promise<RuntimeSchema<T>> {
      if (cache) return cache

      const stored: Partial<OnDiskSchema<T>> = (await store.get(filename)) ?? {}

      const result = {} as RuntimeSchema<T>

      for (const [key, definition] of Object.entries(schema) as [
        keyof T,
        T[keyof T],
      ][]) {
        const storedOption = stored[key]

        type RuntimeValue = RuntimeSchema<T>[typeof key]

        function isEncryptedValue(
          value: unknown,
        ): value is { __encrypted: true; value: string } {
          return (
            typeof value === 'object' &&
            value !== null &&
            '__encrypted' in value &&
            value.__encrypted === true &&
            'value' in value
          )
        }

        function isSecretDefinition(
          definition: Schema[keyof Schema],
        ): definition is { secret: true; default?: RuntimeValue } {
          return (
            typeof definition === 'object' &&
            definition !== null &&
            'secret' in definition &&
            definition.secret === true
          )
        }

        if (isSecretDefinition(definition) && isEncryptedValue(storedOption)) {
          try {
            result[key] = <RuntimeValue>decrypt(storedOption.value)
          } catch {
            if (definition.default != null) {
              result[key] = definition.default
            }
          }
        } else {
          result[key] = <RuntimeValue>(storedOption ?? definition.default)
        }
      }

      cache = result
      return result
    }

    async function persist(data: RuntimeSchema<T>) {
      const output: { [K in keyof T]?: OnDiskValue<T[K]> } = {}

      for (const key of Object.keys(schema) as (keyof T)[]) {
        const definition = schema[key]!
        const value = data[key]

        if (definition.secret && value) {
          const encrypted = encrypt(value as string)

          output[key] = {
            __encrypted: true,
            value: encrypted,
          } as OnDiskValue<T[typeof key]>
        } else {
          output[key] = value as OnDiskValue<T[typeof key]>
        }
      }

      await store.set(filename, output)
      cache = data
    }

    const getCache = () => {
      if (!cache)
        throw new Error(`Settings not initialized. Call .init() first`)
      return cache
    }

    const settingsProvider = {
      namespace,
      async init() {
        if (!cache) await load()
        return this
      },
      get<K extends keyof T>(key: K): RuntimeSchema<T>[K] {
        return getCache()[key]
      },

      async set<K extends keyof T>(key: K, value: RuntimeSchema<T>[K]) {
        const cache = getCache()
        cache[key] = value
        await persist(cache)
      },

      getAll(): RuntimeSchema<T> {
        return getCache()
      },

      isSecret(key: keyof T) {
        return schema[key]?.secret === true
      },
    }
    this.registry.register(namespace, settingsProvider)
    return settingsProvider
  }
}
