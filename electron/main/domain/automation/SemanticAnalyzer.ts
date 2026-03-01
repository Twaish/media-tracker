import {
  Action,
  Expression,
  LiteralExpression,
  RuleNode,
  TemplateNode,
} from './types'

export class SemanticAnalyzer {
  /**
   * Performs static analysis to add configs- and secrets-dependencies
   *
   * Given DSL that uses config() or secret()
   * ```
   * config("discord.logs.url")
   * secret("discordToken")
   * ```
   *
   * will enrich the node with
   * ```json
   * {
   *  "requires": {
   *    "config": ["discord.logs.url"],
   *    "secret": ["discordToken"]
   *  }
   * }
   * ```
   *
   * @param node The node to analyze
   * @returns The node with requirements
   */
  enrich(node: TemplateNode | RuleNode): TemplateNode | RuleNode {
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
