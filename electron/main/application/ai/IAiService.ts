export interface IAiService {
  getVersion(): Promise<string>
  listModels(): Promise<string[]>
  isAvailable(): Promise<boolean>
}
