export type ExpressionServices = {
  now(): Date
  concat(...args: string[]): string
  config(key: string): Promise<string>
  secret(key: string): Promise<string>
}
