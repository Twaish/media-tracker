export type ExportSchema = {
  /**
   * The relative export path
   */
  path: string

  /**
   * A function that exports something given a path
   *
   * @param dest The full destination path
   */
  callback: (dest: string) => void
}

export interface IExportManager {
  /**
   * Starts export pipeline by calling export schemas
   *
   * @param dest The folder path. Will be passed to export schemas
   */
  export(dest: string): void

  /**
   * Add an export schema
   *
   * @param exportSchema The export schema
   */
  addExportSchema(exportSchema: ExportSchema): void

  /**
   * Add multiple export schemas
   *
   * @param exportSchemas The export schemas
   */
  addExportSchemas(exportSchemas: ExportSchema[]): void
}
