import { RuleNode } from '../../domain/ast/RuleNode'
import { TemplateNode } from '../../domain/ast/TemplateNode'
import { EntityEvent } from '../../domain/runtime/EntityEvent'
import { RuleContext } from '../../domain/runtime/RuleContext'
import { IRuleEngine } from '../interfaces/IRuleEngine'
import { ActionExecutor } from './ActionExecutor'
import { ExpressionEvaluator } from './ExpressionEvaluator'

export class RuleEngine implements IRuleEngine {
  private rules: RuleNode[] = []
  private templates: Record<string, TemplateNode> = {}

  constructor(
    private readonly evaluator: ExpressionEvaluator,
    private readonly executor: ActionExecutor,
  ) {}

  registerRule(rule: RuleNode) {
    const index = this.rules.findIndex((r) => r.name === rule.name)
    if (index === -1) {
      this.rules.push(rule)
    } else {
      this.rules[index] = rule
    }
  }

  registerTemplate(template: TemplateNode) {
    this.templates[template.name] = template
  }

  async handle<T extends Record<string, unknown>>(
    event: string,
    data: EntityEvent<T>,
  ): Promise<void> {
    const context = this.createContext(data)

    const byPriority = (a: RuleNode, b: RuleNode) => a.priority - b.priority
    const onlyEnabledAndTargetted = (r: RuleNode) =>
      r.enabled && r.events.includes(event)

    const applicable = this.rules
      .filter(onlyEnabledAndTargetted)
      .sort(byPriority)

    for (const rule of applicable) {
      const shouldFire = await this.shouldFire(rule, context)

      if (!shouldFire) continue

      await this.executor.execute(rule.actions, context)
    }
  }

  async executeTemplate<T extends Record<string, unknown>>(
    name: string,
    parameters: T,
    context?: RuleContext<T>,
  ): Promise<void> {
    const template = this.templates[name]

    if (!template) {
      throw new Error(`Template not found: ${name}`)
    }

    context ??= this.createContext({ current: parameters })

    if (context.activeRules.has(name)) {
      throw new Error(`Recursive template execution detected: ${name}`)
    }

    context.activeRules.add(name)

    const templateContext: RuleContext<Record<string, unknown>> = {
      ...context,
      current: parameters,
    }

    await this.executor.execute(template.actions, templateContext)

    context.activeRules.delete(name)
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
  private async shouldFire<T>(
    rule: RuleNode,
    context: RuleContext<T>,
  ): Promise<boolean> {
    const current = (await this.evaluator.evaluate(
      rule.condition,
      context.current,
    )) as boolean

    if (rule.trigger === 'ON') {
      return current
    }

    if (rule.trigger === 'ONCE') {
      if (!context.previous) return false

      const previous = (await this.evaluator.evaluate(
        rule.condition,
        context.previous,
      )) as boolean

      return !previous && !!current
    }

    return false
  }

  /**
   * Creates a rule context for an entity event
   *
   * @param event The entity event
   * @returns The rule context
   */
  private createContext<T>(event: EntityEvent<T>): RuleContext<T> {
    return {
      ...event,
      activeRules: new Set<string>(),
    }
  }
}
