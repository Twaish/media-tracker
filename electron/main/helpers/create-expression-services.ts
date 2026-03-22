import { ExpressionServices } from '@/features/automation/domain/services/ExpressionServices'

export function createExpressionServices(): ExpressionServices {
  return {
    now: () => new Date(),
    config: async (_: string) => 'Config key',
    secret: async (_: string) => 'Secret key',
    concat: (...args: string[]) => args.join(''),
  }
}
