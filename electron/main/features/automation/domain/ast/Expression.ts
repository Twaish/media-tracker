export type Expression =
  | LiteralExpression
  | FieldExpression
  | FunctionExpression
  | ObjectExpression
  | SelfExpression
  | BinaryExpression
  | MemberExpression

export type LiteralExpression = {
  type: 'literal'
  value: string | number | boolean
}

export type FieldExpression = {
  type: 'field'
  name: string
}

export type MemberExpression = {
  type: 'member'
  property: string
  object: Expression
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
