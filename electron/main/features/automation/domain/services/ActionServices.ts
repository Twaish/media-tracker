export type ActionServices = {
  callTemplate(name: string, ...args: unknown[]): Promise<void>
  callPlugin(name: string, ...args: unknown[]): Promise<void>
}
