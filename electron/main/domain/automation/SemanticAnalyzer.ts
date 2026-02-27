import { Action, Expression, LiteralExpression, Rule, Template } from './types'

export class SemanticAnalyzer {
  enrich(node: Template | Rule): Template | Rule {
    if (node.type === 'template') {
      node.requires = this.extractRequires(node.actions)
    }
    return node
  }

  private extractRequires(actions: Action[]) {
    const config = new Set<string>()
    const secrets = new Set<string>()

    const visit = (expr: Expression) => {
      if (expr.type === 'function') {
        if (expr.name === 'config') {
          const key = (expr.args[0] as LiteralExpression).value
          config.add(key as string)
        }

        if (expr.name === 'secret') {
          const key = (expr.args[0] as LiteralExpression).value
          secrets.add(key as string)
        }

        expr.args.forEach(visit)
      }

      if (expr.type === 'object') {
        Object.values(expr.value).forEach(visit)
      }
    }

    for (const action of actions) {
      for (const value of Object.values(action)) {
        if (value && typeof value === 'object' && 'type' in value) {
          visit(value as Expression)
        }
      }
    }

    return {
      config: [...config],
      secrets: [...secrets],
    }
  }
}
