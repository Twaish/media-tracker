export interface IAiService {
  getVersion(): Promise<string>
  listModels(): Promise<string[]>
  getModelCapabilities(model: string): Promise<string[]>
  isAvailable(): Promise<boolean>
  embed(text: string, model?: string): Promise<number[]>
  generateJson<T>(prompt: string, model: string): Promise<T>
  webFetch(url: string): Promise<string>
}
