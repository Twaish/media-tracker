import { IPermissionRegistry } from '../../application/ports/IPermissionRegistry'

export class PermissionRegistry implements IPermissionRegistry {
  permissions: Map<string, Record<string, unknown>> = new Map()
  baseContext: Record<string, unknown> = {}

  setBaseContext(context: Record<string, unknown>) {
    this.baseContext = context
  }

  register(
    permission: string,
    contextExtension: Record<string, unknown>,
  ): void {
    if (this.permissions.has(permission)) {
      throw new Error(`Permission "${permission}" is already registered`)
    }
    this.permissions.set(permission, contextExtension)
  }

  buildContext<T>(permissions: string[]): T {
    let context: Record<string, unknown> = { ...this.baseContext }

    permissions.forEach((permission) => {
      const extension = this.permissions.get(permission)
      if (!extension) return

      context = this.deepMerge(context, extension)
    })

    return context as T
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  private deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = { ...target }

    for (const key of Object.keys(source)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (this.isObject(sourceValue) && this.isObject(targetValue)) {
        result[key] = this.deepMerge(targetValue, sourceValue)
      } else {
        result[key] = sourceValue
      }
    }

    return result
  }
}
