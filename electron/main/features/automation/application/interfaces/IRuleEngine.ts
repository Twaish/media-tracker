import { RuleNode } from '../../domain/ast/RuleNode'
import { TemplateNode } from '../../domain/ast/TemplateNode'
import { EntityEvent } from '../../domain/runtime/EntityEvent'
import { RuleContext } from '../../domain/runtime/RuleContext'

export interface IRuleEngine {
  /**
   * Registers a rule allowing it to be executed
   *
   * @param rule The rule to register
   */
  registerRule(rule: RuleNode): void

  /**
   * Registers a template allowing it to be executed by a rule
   *
   * @param template The template to register
   */
  registerTemplate(template: TemplateNode): void

  /**
   * Evaluates and execute all applicable rules for a given event
   *
   * Rules are:
   * - Filtered by `enabled === true`
   * - Matched against the provided = `event`
   * - Sorted by ascending priority
   *
   * @param event Event name used to match rules
   * @param data Entity event data containing current and previous state
   */
  handle<T extends Record<string, unknown>>(
    event: string,
    data: EntityEvent<T>,
  ): Promise<void>

  /**
   * Executes a registered template by name
   *
   * @param name The template name
   * @param parameters Parameters exposed to the template as `current`
   * @param context Optional existing rule execution context
   */
  executeTemplate<T extends Record<string, unknown>>(
    name: string,
    parameters: T,
    context?: RuleContext<T>,
  ): Promise<void>
}
