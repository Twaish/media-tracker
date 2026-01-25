import { createLogger, format } from 'winston'
import { ILogger, IWinstonLogger } from './types'
import { timestampFormat } from './formats'
import { StreamTransportInstance } from 'winston/lib/winston/transports'

export class WinstonLogger implements ILogger {
  private logger: IWinstonLogger

  constructor(transports: StreamTransportInstance[]) {
    this.logger = createLogger({
      level: 'debug',
      format: format.combine(timestampFormat(), format.errors({ stack: true })),
      transports,
    }) as IWinstonLogger
    this.logger.header = (text: string, width = 100, char = '=') => {
      text = ` ${text} `
      let line: string
      if (text.length >= width) {
        line = text
      } else {
        const padLen = Math.floor((width - text.length) / 2)
        line =
          char.repeat(padLen) + text + char.repeat(width - text.length - padLen)
      }
      this.logger.info(line)
    }
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, ...(meta ?? []))
  }
  info(message: string, meta?: any): void {
    this.logger.info(message, ...(meta ?? []))
  }
  warn(message: string, meta?: any): void {
    this.logger.warn(message, ...(meta ?? []))
  }
  error(message: string | Error, meta?: any): void {
    this.logger.error(message?.toString(), ...(meta ?? []))
  }
  header(text: string, width?: number, char?: string): void {
    this.logger.header(text, width, char)
  }
}
