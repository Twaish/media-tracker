import { ExpressionServices } from '@/domain/automation/types'

export function createExpressionServices(): ExpressionServices {
  return {
    now: () => new Date(),
    config: async (key) => 'Config key',
    secret: async (key) => 'Secret key',
    concat: (...args) => args.join(''),
  }
}
