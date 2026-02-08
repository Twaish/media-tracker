export interface ILogger {
  debug(message: string, meta?: any): void
  info(message: string, meta?: any): void
  warn(message: string, meta?: any): void
  error(message: string | Error, meta?: any): void
  header(text: string, width?: number, char?: string): void
}
