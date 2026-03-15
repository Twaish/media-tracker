import {
  BinaryExpression,
  Expression,
  ExpressionServices,
  FunctionExpression,
  MemberExpression,
  ObjectExpression,
} from './types'

export class ExpressionEvaluator {
  private services?: ExpressionServices

  setServices(services: ExpressionServices) {
    this.services = services
  }

  async evaluate<T>(expression: Expression, data: T): Promise<unknown> {
    switch (expression.type) {
      case 'literal':
        return expression.value
      case 'field':
        return data?.[expression.name as keyof typeof data]
      case 'function':
        return this.executeFunction(expression, data)
      case 'binary':
        return this.evaluateBinary(expression, data)
      case 'object':
        return this.evaluateObject(expression, data)
      case 'self':
        return data
      case 'member':
        return this.evaluateMember(expression, data)
      default:
        throw new Error(
          `Unknown expression type: ${expression satisfies never}`,
        )
    }
  }

  private async evaluateMember<T>(
    expression: MemberExpression,
    data: T,
  ): Promise<unknown> {
    const object = await this.evaluate(expression.object, data)
    return (object as Record<string, unknown>)?.[expression.property]
  }

  private async evaluateObject<T>(
    expression: ObjectExpression,
    data: T,
  ): Promise<object> {
    const result: Record<string, unknown> = {}

    for (const key in expression.value) {
      const value = await this.evaluate(expression.value[key], data)

      result[key] = value
    }

    return result
  }

  private async evaluateBinary<T>(
    expression: BinaryExpression,
    data: T,
  ): Promise<boolean> {
    const left = (await this.evaluate(expression.left, data)) as number
    const right = (await this.evaluate(expression.right, data)) as number

    switch (expression.operator) {
      case '>':
        return left > right
      case '>=':
        return left >= right
      case '<':
        return left < right
      case '<=':
        return left <= right
      case '==':
        return left === right
      case '!=':
        return left != right
    }
  }

  private async executeFunction<T>(
    expression: FunctionExpression,
    data: T,
  ): Promise<unknown> {
    if (!this.services) {
      throw new Error(`Expression services not set`)
    }
    const args = await Promise.all(
      expression.args.map((arg) => this.evaluate(arg, data)),
    )

    const expressionName = expression.name as keyof ExpressionServices

    switch (expressionName) {
      case 'now':
        return this.services.now()
      case 'config':
        return this.services.config(args[0] as string)
      case 'secret':
        return this.services.secret(args[0] as string)
      case 'concat':
        return this.services.concat(...(args as string[]))
      default: {
        throw new Error(`Unhandled function: ${expressionName satisfies never}`)
      }
    }
  }
}
