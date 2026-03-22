import { Expression } from './Expression'

export type Action =
  | HttpAction
  | SetAction
  | AppendAction
  | TemplateAction
  | PluginAction

export const HttpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const

export type HttpMethod = (typeof HttpMethods)[number]

export type HttpAction = {
  type: 'http'
  url: Expression
  method: HttpMethod
  body?: Expression
  headers?: Expression
  retry?: {
    attempts: number
    strategy: 'exponential'
    delayMs: number
  }
}

export type SetAction = {
  type: 'set'
  field: string
  value: Expression
}

export type AppendAction = {
  type: 'append'
  field: string
  value: Expression
}

export type TemplateAction = {
  type: 'template'
  name: string
  args: Record<string, Expression>
}

export type PluginAction = {
  type: 'plugin'
  name: string
  args: Record<string, Expression>
}
