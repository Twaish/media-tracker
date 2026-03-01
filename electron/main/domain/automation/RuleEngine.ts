import { ActionExecutor } from './ActionExecutor'
import { ExpressionEvaluator } from './ExpressionEvaluator'
import { Rule, RuleContext, Template } from './types'

export class RuleEngine {
  private rules: Rule[] = []
  private templates: Record<string, Template> = {}

  constructor(
    private readonly evaluator: ExpressionEvaluator,
    private readonly executor: ActionExecutor,
  ) {}

  registerRule(rule: Rule) {
    const index = this.rules.findIndex((r) => r.name === rule.name)
    if (index === -1) {
      this.rules.push(rule)
    }
  }

  registerTemplate(template: Template) {
    this.templates[template.name] ??= template
  }

  async handle<T extends Record<string, unknown>>(
    target: string,
    context: RuleContext<T>,
  ): Promise<void> {
    const applicable = this.rules
      .filter((r) => r.enabled && r.target === target)
      .sort((a, b) => a.priority - b.priority)

    for (const rule of applicable) {
      const shouldFire = this.shouldFire(rule, context)

      if (!shouldFire) continue

      await this.executor.execute(rule.actions, context)
    }
  }

  private shouldFire<T>(rule: Rule, context: RuleContext<T>): boolean {
    const current = this.evaluator.evaluate(
      rule.condition,
      context.current,
    ) as boolean

    if (rule.trigger === 'ON') {
      return current
    }

    if (rule.trigger === 'ONCE') {
      if (!context.previous) return false

      const previous = this.evaluator.evaluate(
        rule.condition,
        context.previous,
      ) as boolean

      return !previous && !!current
    }

    return false
  }
}
