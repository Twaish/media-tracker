export type ExportSchema = {
  path: string
  callback: (dest: string) => void
}

export interface IExportManager {
  export(dest: string): void
  addExportSchema(exportSchema: ExportSchema): void
}
