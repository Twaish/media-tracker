import fs from 'fs/promises'
import path from 'path'

export const at = <T, K>(path: T, callbacks: K[]) =>
  callbacks.flat().map((callback) => ({ path, callback }))

export const sub = <T, K extends { path: string }>(path: T, items: K[]) =>
  items.flat().map((item) => ({ ...item, path: `${path}/${item.path}` }))

export const resolveDeep = async <T>(obj: T): Promise<T | T[]> => {
  if (obj instanceof Promise) return resolveDeep(await obj)

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(resolveDeep))
  }

  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const entries = await Promise.all(
      Object.entries(obj).map(async ([k, v]) => [k, await resolveDeep(v)]),
    )
    return Object.fromEntries(entries)
  }

  return obj
}

export const json =
  (filename: string, content: object) => async (dest: string) => {
    const value = typeof content === 'function' ? await content() : content
    const resolved = await resolveDeep(value)

    fs.writeFile(path.join(dest, filename), JSON.stringify(resolved, null, 2))
  }

export const isAsyncIterable = <T = unknown>(
  v: unknown,
): v is AsyncIterable<T> =>
  typeof v === 'object' &&
  v != null &&
  Symbol.asyncIterator in v &&
  typeof v[Symbol.asyncIterator] === 'function'

export const jsonStream =
  <T>(filename: string, content: Record<string, T>) =>
  async (dest: string) => {
    const file = await fs.open(path.join(dest, filename), 'w')

    await file.write('{\n')

    const entries = Object.entries(content)

    for (let i = 0; i < entries.length; i++) {
      const [key, rawValue] = entries[i]
      const value = typeof rawValue === 'function' ? rawValue() : rawValue

      await file.write(`  "${key}": `)

      if (isAsyncIterable(value)) {
        await file.write('[')
        let first = true

        for await (const item of value) {
          if (!first) await file.write(',')
          first = false
          await file.write(JSON.stringify(item))
        }

        await file.write(']')
      } else {
        const resolved = await value
        await file.write(JSON.stringify(resolved))
      }

      if (i < entries.length - 1) {
        await file.write(',')
      }

      await file.write('\n')
    }

    await file.write('}')
    await file.close()
  }
