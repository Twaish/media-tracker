export interface IAiSettingsProvider {
  host: string
  init(): Promise<void>
  updateHost(newHost: string): Promise<void>
  onHostChanged(listener: (host: string) => void): () => void
}
