import { transports } from 'winston'
import { Format } from './types'

export function createConsoleTransport(format: Format) {
  return new transports.Console({ format })
}

export function createFileTransport(filename: string, format: Format) {
  return new transports.File({ filename, format })
}
