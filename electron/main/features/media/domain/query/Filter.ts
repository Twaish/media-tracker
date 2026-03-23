export type Operator = '=' | '!=' | '<' | '<=' | '>' | '>='

export interface Filter {
  field: string
  op: Operator
  values: (string | number)[]
}
