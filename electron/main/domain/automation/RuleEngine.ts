import { ActionExecutor } from './ActionExecutor'
import { ExpressionEvaluator } from './ExpressionEvaluator'
import { RuleNode, RuleContext, TemplateNode } from './types'

export class RuleEngine {
  private rules: RuleNode[] = []
  private templates: Record<string, TemplateNode> = {}

  constructor(
    private readonly evaluator: ExpressionEvaluator,
    private readonly executor: ActionExecutor,
  ) {}

  /**
   * Registers a rule allowing it to be executed
   *
   * @param rule The rule to register
   */
  registerRule(rule: RuleNode) {
    const index = this.rules.findIndex((r) => r.name === rule.name)
    if (index === -1) {
      this.rules.push(rule)
    }
  }

  /**
   * Registers a template allowing it to be executed by a rule
   *
   * @param template The template to register
   */
  registerTemplate(template: TemplateNode) {
    this.templates[template.name] ??= template
  }

  /**
   * Evaluates and execute all applicable rules for a given target
   *
   * Rules are:
   * - Filtered by `enabled === true`
   * - Matched against the provided = `target`
   * - Sorted by ascending priority
   *
   * @param target Target identifier used to match rules
   * @param context Execution context containing current and previous state
   */
  async handle<T extends Record<string, unknown>>(
    target: string,
    context: RuleContext<T>,
  ): Promise<void> {
    const byPriority = (a: RuleNode, b: RuleNode) => a.priority - b.priority
    const onlyEnabledAndTargetted = (r: RuleNode) =>
      r.enabled && r.target === target

    const applicable = this.rules
      .filter(onlyEnabledAndTargetted)
      .sort(byPriority)

    for (const rule of applicable) {
      const shouldFire = this.shouldFire(rule, context)

      if (!shouldFire) continue

      await this.executor.execute(rule.actions, context)
    }
  }

  /**
   * Determines whether a rule should fire based on its trigger type
   *
   * Supported triggers:
   * - `ON`: Fires whenever the condition evaluates to true
   * - `ONCE`: Fires only when the condition transitions `false (previous) -> true (current)`
   *
   * @param rule Rule to evaluate
   * @param context Execution context containing current and previous state
   * @returns
   */
  private shouldFire<T>(rule: RuleNode, context: RuleContext<T>): boolean {
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
