import fs from 'fs/promises'
import path from 'path'

export const resolveDeep = async <T>(obj: T): Promise<T | T[]> => {
  if (obj instanceof Promise) return resolveDeep(await obj)

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(resolveDeep))
  }

  if (typeof obj === 'function') {
    return await obj()
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

    const indent = (n: number) => ' '.repeat(n)

    await file.write('{\n')

    const entries = Object.entries(content)

    for (let i = 0; i < entries.length; i++) {
      const [key, rawValue] = entries[i]
      const value = typeof rawValue === 'function' ? rawValue() : rawValue

      await file.write(`${indent(2)}"${key}": `)

      if (isAsyncIterable(value)) {
        await file.write('[\n')
        let first = true

        for await (const item of value) {
          if (!first) await file.write(',\n')
          first = false
          await file.write(
            JSON.stringify(item, null, 2)
              .split('\n')
              .map((line) => indent(4) + line)
              .join('\n'),
          )
        }

        await file.write(`\n${indent(2)}]`)
      } else {
        const resolved = await value
        await file.write(
          JSON.stringify(resolved, null, 2)
            .split('\n')
            .map((line, idx) => (idx === 0 ? line : indent(2) + line))
            .join('\n'),
        )
      }

      if (i < entries.length - 1) {
        await file.write(',')
      }

      await file.write('\n')
    }

    await file.write('}')
    await file.close()
  }
