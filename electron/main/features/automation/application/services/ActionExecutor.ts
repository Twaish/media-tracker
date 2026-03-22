import {
  Action,
  TemplateAction,
  PluginAction,
  HttpAction,
} from '../../domain/ast/Action'
import { Expression } from '../../domain/ast/Expression'
import { RuleContext } from '../../domain/runtime/RuleContext'
import { ActionServices } from '../../domain/services/ActionServices'
import { ExpressionEvaluator } from './ExpressionEvaluator'

export class ActionExecutor {
  private services?: ActionServices

  constructor(private readonly evaluator: ExpressionEvaluator) {}

  setServices(services: ActionServices) {
    this.services = services
  }

  async execute<T extends Record<string, unknown>>(
    actions: Action[],
    context: RuleContext<T>,
  ): Promise<void> {
    if (!this.services) {
      throw new Error('Action services not set')
    }

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
        await this.executeTemplate(action, context)
        break
      }
      case 'plugin': {
        await this.executePlugin(action, context)
        break
      }
      case 'http': {
        await this.executeHttp(action, context)
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
    const resolved = await this.resolveArgs(action.args, context)
    await this.services!.callTemplate(action.name, resolved, context)
  }

  private async executePlugin<T>(
    action: PluginAction,
    context: RuleContext<T>,
  ) {
    const resolved = await this.resolveArgs(action.args, context)
    await this.services!.callPlugin(action.name, resolved)
  }

  private async executeHttp<T>(action: HttpAction, context: RuleContext<T>) {
    const url = (await this.evaluator.evaluate(
      action.url,
      context.current,
    )) as string

    let body
    if (action.body) {
      body = (await this.evaluator.evaluate(
        action.body,
        context.current,
      )) as BodyInit
    }

    let headers
    if (action.headers) {
      headers = (await this.evaluator.evaluate(
        action.headers,
        context.current,
      )) as HeadersInit
    }

    const response = await fetch(url, {
      method: action.method,
      body,
      headers,
    })

    return response
  }

  private async resolveArgs<T>(
    args: Record<string, Expression>,
    context: RuleContext<T>,
  ) {
    const result: Record<string, unknown> = {}

    for (const key in args) {
      result[key] = await this.evaluator.evaluate(args[key], context.current)
    }

    return result
  }
}
