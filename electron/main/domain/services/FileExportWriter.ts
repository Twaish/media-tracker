import fs from 'fs'

export class FileExportWriter {
  private stream!: fs.WriteStream
  private firstArray = true
  private firstItem = true

  async open(path: string) {
    if (fs.existsSync(path)) {
      throw new Error(`${path} already exists`)
    }
    this.stream = fs.createWriteStream(path)
  }

  async beginObject() {
    this.stream.write('{')
  }

  async endObject() {
    this.stream.write('}')
  }

  async exportArray<T>(name: string, array: T[]): Promise<void>
  async exportArray<T>(name: string, stream: AsyncIterable<T>): Promise<void>
  async exportArray<T>(
    name: string,
    source: T[] | AsyncIterable<T>,
  ): Promise<void> {
    await this.beginArray(name)

    for await (const item of source) {
      await this.writeItem(item)
    }

    this.endArray()
  }

  async beginArray(name: string) {
    if (!this.firstArray) this.stream.write(',')
    this.firstArray = false

    this.stream.write(`"${name}":[`)
    this.firstItem = true
  }

  async writeItem(item: unknown) {
    if (!this.firstItem) this.stream.write(',')
    this.firstItem = false

    this.stream.write(JSON.stringify(item))
  }

  async endArray() {
    this.stream.write(']')
  }

  async close() {
    this.stream.end()
  }
}
