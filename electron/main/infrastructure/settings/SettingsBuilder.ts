import {
  ISettingsBuilder,
  OnDiskSchema,
  OnDiskValue,
  RuntimeSchema,
  RuntimeValue,
  Schema,
} from '@/application/ports/settings/ISettingsBuilder'
import { JsonStore } from '@/core/JsonStore'

type SettingsBuilderOptions = {
  store: JsonStore
  encrypt: (value: string) => string
  decrypt: (value: string) => string
}

export class SettingsBuilder implements ISettingsBuilder {
  constructor(private readonly options: SettingsBuilderOptions) {}

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

      for (const key of Object.keys(schema) as (keyof T)[]) {
        const definition = schema[key]!
        const storedOption = stored[key as string]

        if (
          definition.secret &&
          typeof storedOption === 'object' &&
          storedOption &&
          '__encrypted' in storedOption
        ) {
          try {
            result[key] = decrypt(storedOption.value) as RuntimeValue<
              T[typeof key]
            >
          } catch {
            result[key] = definition.default
          }
        } else {
          result[key] = storedOption ?? definition.default
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

    return {
      namespace,
      async init() {
        if (!cache) await load()
      },
      get<K extends keyof T>(key: K): RuntimeSchema<T>[K] {
        if (!cache)
          throw new Error(`Settings not initialized. Call .init() first`)
        return cache[key]
      },

      async set<K extends keyof T>(key: K, value: RuntimeSchema<T>[K]) {
        const data = await load()
        data[key] = value
        await persist(data)
      },

      getAll(): RuntimeSchema<T> {
        if (!cache)
          throw new Error(`Settings not initialized. Call .init() first`)
        return cache
      },

      isSecret(key: keyof T) {
        return schema[key]?.secret === true
      },
    }
  }
}
