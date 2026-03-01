export type Expression =
  | LiteralExpression
  | FieldExpression
  | FunctionExpression
  | ObjectExpression
  | SelfExpression
  | BinaryExpression

export type LiteralExpression = {
  type: 'literal'
  value: string | number | boolean
}

export type FieldExpression = {
  type: 'field'
  name: string
}

export type FunctionExpression = {
  type: 'function'
  name: string
  args: Expression[]
}

export type ObjectExpression = {
  type: 'object'
  value: Record<string, Expression>
}

export type SelfExpression = {
  type: 'self'
}

export type BinaryExpression = {
  type: 'binary'
  operator: '>' | '<' | '>=' | '<=' | '==' | '!='
  left: Expression
  right: Expression
}

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

export enum TokenType {
  Identifier = 'identifier',
  Number = 'number',
  String = 'string',
  Operator = 'operator',
  LParen = 'lparen',
  RParen = 'rparen',
  LBrace = 'lbrace',
  RBrace = 'rbrace',
  Comma = 'comma',
  Dot = '.',
  Keyword = 'keyword',
  EOF = 'eof',
}

export type Template = {
  type: 'template'
  name: string
  parameters: string[]
  requires?: {
    config?: string[]
    secrets?: string[]
  }
  actions: Action[]
}

export type Rule = {
  type: 'rule'
  name: string
  trigger: string
  target: string
  priority: number
  enabled: boolean
  condition: BinaryExpression
  execution: 'sequential'
  actions: Action[]
}

export type Token = {
  type: TokenType
  value: string
}

export const KEYWORDS = new Set([
  'TEMPLATE',
  'PARAMETERS',
  'DO',
  'RULE',
  'ON',
  'ONCE',
  'PRIORITY',
  'METHOD',
  'BODY',
  'HEADERS',
  'RETRY',
  'EXPONENTIAL',
  'DELAY',
  'call',
  'set',
  'add',
])

export type RuleContext<T> = {
  current: T
  previous?: T
  event?: unknown
  services: RuleExecutionServices
  activeRules: Set<string>
}

export type RuleExecutionServices = {
  now(): Date
  callTemplate(name: string, ...args: unknown[]): Promise<void>
  callPlugin(name: string, ...args: unknown[]): Promise<void>
}
