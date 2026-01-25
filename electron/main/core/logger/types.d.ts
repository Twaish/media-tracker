import { Logger } from 'winston'
import { ConsoleTransportOptions } from 'winston/lib/winston/transports'

export interface IWinstonLogger extends Logger {
  header(text: string, width?: number, char?: string): void
}

export interface ILogger {
  debug(message: string, meta?: any): void
  info(message: string, meta?: any): void
  warn(message: string, meta?: any): void
  error(message: string | Error, meta?: any): void
  header(text: string, width?: number, char?: string): void
}
// ConsoleTransportOptions['format'] is a shared type between different transports
// and is just extracted here
export type Format = ConsoleTransportOptions['format']
