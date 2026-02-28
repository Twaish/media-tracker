import { ActionExecutor } from './ActionExecutor'
import { ExpressionEvaluator } from './ExpressionEvaluator'
import { RuleEngineCompiler } from './RuleEngineCompiler'
import { RuleEnginePrinter } from './RuleEnginePrinter'
import { Rule, RuleContext, Template } from './types'

export class RuleEngine {
  private rules: Rule[] = []
  private templates: Record<string, Template> = {}

  constructor(
    private readonly compiler: RuleEngineCompiler,
    private readonly printer: RuleEnginePrinter,
    private readonly evaluator: ExpressionEvaluator,
    private readonly executor: ActionExecutor,
  ) {}

  compile(source: string): Template | Rule {
    return this.compiler.compile(source)
  }

  print(node: Template | Rule): string {
    return this.printer.print(node)
  }

  registerRule(rule: Rule) {
    const index = this.rules.findIndex((r) => r.id === rule.id)
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
