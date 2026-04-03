export type ImportSchema = {
  /**
   * The relative import path
   */
  path: string

  /**
   * A function that imports something given a path
   *
   * @param src The full path to the file
   */
  callback: (src: string) => Promise<void>

  /**
   * The order to execute this schema
   */
  order: number
}

export interface IImportManager {
  /**
   * Starts import pipeline by calling import schemas in order
   *
   * @param src The folder path. Will be passed to import schemas
   */
  import(src: string): Promise<void>

  /**
   * Add an import schema
   *
   * @param importSchema The import schema
   */
  addImportSchema(importSchema: ImportSchema): void

  /**
   * Add multiple import schemas
   *
   * @param importSchemas The import schemas
   */
  addImportSchemas(importSchemas: ImportSchema[]): void
}
