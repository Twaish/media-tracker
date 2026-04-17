export interface IPermissionRegistry {
  setBaseContext(context: Record<string, unknown>): void
  getPermissionKeys(): string[]
  register<T extends Record<string, unknown>>(
    permission: string,
    contextExtension: Readonly<T>,
  ): void
  buildContext<T extends Record<string, unknown> = Record<string, unknown>>(
    permissions: string[],
  ): T
}
