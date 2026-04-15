import { format } from 'winston'

const COLORS: Record<string, string> = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
  dim: '\x1b[90m',
}

export const timestampFormat = format((info) => {
  const now = new Date()
  const ms = String(now.getMilliseconds()).padStart(3, '0')
  info.timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${ms}`
  return info
})

export const consoleFormat = format.printf((info) => {
  const color = COLORS[info.level] || ''
  const reset = COLORS.reset
  const dim = COLORS.dim
  const timestamp = info.timestamp

  return `${dim}${timestamp}${reset} ${color}[${info.level.toUpperCase()}]${reset} ${info.message}${
    info.stack ? `\n${info.stack}` : ''
  }`
})

export const fileFormat = format.printf((info) => {
  const timestamp = info.timestamp
  return `${timestamp} [${info.level.toUpperCase()}] ${info.message}${
    info.stack ? `\n${info.stack}` : ''
  }`
})
