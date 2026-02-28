import { BinaryExpression, Expression, ObjectExpression } from './types'

export class ExpressionEvaluator {
  evaluate<T>(expression: Expression, data: T): unknown {
    switch (expression.type) {
      case 'literal':
        return expression.value
      case 'field':
        return data?.[expression.name as keyof typeof data]
      case 'function':
        return this.executeFunction(expression.name)
      case 'binary':
        return this.evaluateBinary(expression, data)
      case 'object':
        return this.evaluateObject(expression, data)
      case 'self':
        return data
      default:
        throw new Error(
          `Unknown expression type: ${expression satisfies never}`,
        )
    }
  }

  private evaluateObject<T>(expression: ObjectExpression, data: T): object {
    const result: Record<string, unknown> = {}

    for (const key in expression.value) {
      const value = this.evaluate(expression.value[key], data)

      result[key] = value
    }

    return result
  }

  private evaluateBinary<T>(expression: BinaryExpression, data: T): boolean {
    const left = this.evaluate(expression.left, data) as number
    const right = this.evaluate(expression.right, data) as number

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

  private executeFunction(name: string): unknown {
    if (name === 'now') return new Date()
    throw new Error(`unknown function: ${name}`)
  }
}
