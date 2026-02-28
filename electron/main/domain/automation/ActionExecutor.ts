import { ExpressionEvaluator } from './ExpressionEvaluator'
import {
  Action,
  Expression,
  HttpAction,
  PluginAction,
  RuleContext,
  TemplateAction,
} from './types'

export class ActionExecutor {
  constructor(private readonly evaluator: ExpressionEvaluator) {}

  async execute<T extends Record<string, unknown>>(
    actions: Action[],
    context: RuleContext<T>,
  ): Promise<void> {
    for (const action of actions) {
      await this.executeAction(action, context)
    }
  }

  private async executeAction<T extends Record<string, unknown>>(
    action: Action,
    context: RuleContext<T>,
  ): Promise<void> {
    switch (action.type) {
      case 'set': {
        const value = this.evaluator.evaluate(action.value, context.current)
        context.current = { ...context.current, [action.field]: value }
        break
      }
      case 'append': {
        const value = this.evaluator.evaluate(action.value, context.current)
        const currentArray = (context.current[action.field] as []) ?? []
        context.current = {
          ...context.current,
          [action.field]: [...currentArray, value],
        }
        break
      }
      case 'template': {
        this.executeTemplate(action, context)
        break
      }
      case 'plugin': {
        this.executePlugin(action, context)
        break
      }
      case 'http': {
        this.executeHttp(action, context)
        break
      }
      default:
        throw new Error(`Unknown action type: ${action satisfies never}`)
    }
  }

  private async executeTemplate<T>(
    action: TemplateAction,
    context: RuleContext<T>,
  ) {
    const resolved = this.resolveArgs(action.args, context)
    await context.services.callTemplate(action.name, resolved)
  }

  private async executePlugin<T>(
    action: PluginAction,
    context: RuleContext<T>,
  ) {
    const resolved = this.resolveArgs(action.args, context)
    await context.services.callPlugin(action.name, resolved)
  }

  private async executeHttp<T>(action: HttpAction, context: RuleContext<T>) {
    const url = this.evaluator.evaluate(action.url, context.current) as string

    let body
    if (action.body) {
      this.evaluator.evaluate(
        action.body,
        context.current,
      ) as HttpAction['body']
    }

    let headers
    if (action.headers) {
      this.evaluator.evaluate(
        action.headers,
        context.current,
      ) as HttpAction['headers']
    }

    const response = await fetch(url, {
      method: action.method,
      body,
      headers,
    })

    return response
  }

  private resolveArgs<T>(
    args: Record<string, Expression>,
    context: RuleContext<T>,
  ) {
    const result: Record<string, unknown> = {}

    for (const key in args) {
      result[key] = this.evaluator.evaluate(args[key], context.current)
    }

    return result
  }
}
