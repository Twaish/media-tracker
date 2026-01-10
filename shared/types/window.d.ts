export interface WindowContext {
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  close: () => Promise<void>
}
