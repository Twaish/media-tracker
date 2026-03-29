import { ISettingsRegistry } from '@/application/ports/settings/ISettingsRegistry'
import { ExpressionServices } from '@/features/automation/domain/services/ExpressionServices'

export function createExpressionServices(
  settingsRegistry: ISettingsRegistry,
): ExpressionServices {
  return {
    now: () => new Date(),
    config: async (keyPath: string) => {
      const [namespace, key] = keyPath.split('.')
      return String(settingsRegistry.get(namespace, key))
    },
    secret: async (keyPath: string) => {
      const [namespace, key] = keyPath.split('.')
      return settingsRegistry.getSecret(namespace, key)
    },
    concat: (...args: string[]) => args.join(''),
  }
}
