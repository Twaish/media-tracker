import {
  Action,
  BinaryExpression,
  Expression,
  HttpAction,
  MemberExpression,
  ObjectExpression,
  RuleNode,
  TemplateNode,
} from './types'

export class RuleEnginePrinter {
  /**
   * Prints the AST representation to DSL equivalent
   *
   * @param node The node to print
   * @returns DSL equivalent for the provided AST node
   */
  print(node: TemplateNode | RuleNode): string {
    if (node.type === 'template') return this.printTemplate(node)
    if (node.type === 'rule') return this.printRule(node)
    throw new Error(`Unknown node type`)
  }

  private printTemplate(template: TemplateNode): string {
    let output = `TEMPLATE ${template.name}\n`

    if (template.parameters.length > 0) {
      output += `PARAMETERS {\n`
      for (const p of template.parameters) {
        output += `  ${p}\n`
      }
      output += `}\n`
    }

    output += `DO {\n`
    output += this.printActions(template.actions, 1)
    output += `}`

    return output
  }

  private printRule(rule: RuleNode): string {
    let output = `RULE ${rule.name}\n`

    output += `FOR ${rule.events.join(', ')}\n`

    output += `${rule.trigger} ${rule.target} ${this.printCondition(rule.condition)}\n`

    if (rule.priority !== 0) {
      output += `PRIORITY ${rule.priority}\n`
    }

    output += `DO {\n`
    output += this.printActions(rule.actions, 1)
    output += `}`

    return output
  }

  private printCondition(condition: BinaryExpression): string {
    if (condition.type === 'binary') {
      return `${this.printExpression(condition.left)} ${condition.operator} ${this.printExpression(condition.right)}`
    }

    throw new Error(`Unsupported condition type`)
  }

  private printActions(actions: Action[], indent: number): string {
    let output = ''
    for (const action of actions) {
      output += this.indent(indent) + this.printAction(action, indent) + '\n'
    }
    return output
  }

  private printAction(action: Action, indent: number): string {
    switch (action.type) {
      case 'set':
        return `set ${action.field} = ${this.printExpression(action.value)}`

      case 'append':
        return `add ${action.field} = ${this.printExpression(action.value)}`

      case 'template':
        return `call template("${action.name}")`

      case 'plugin':
        return `call plugin("${action.name}")`

      case 'http':
        return this.printHttp(action, indent)

      default:
        throw new Error(`Unsupported action type`)
    }
  }

  private printHttp(action: HttpAction, indent: number): string {
    let output = `call http(${this.printExpression(action.url)}) {\n`

    if (action.method) {
      output += this.indent(indent + 1) + `METHOD ${action.method}\n`
    }

    if (action.body) {
      output +=
        this.indent(indent + 1) +
        `BODY ${this.printExpression(action.body, indent + 1)}\n`
    }

    if (action.headers) {
      output +=
        this.indent(indent + 1) +
        `HEADERS ${this.printExpression(action.headers, indent + 1)}\n`
    }

    if (action.retry) {
      output += this.indent(indent + 1)
      output += `RETRY ${action.retry.attempts} EXPONENTIAL DELAY ${action.retry.delayMs}\n`
    }

    output += this.indent(indent) + `}`

    return output
  }

  private printExpression(expr: Expression, indent = 0): string {
    switch (expr.type) {
      case 'literal':
        if (typeof expr.value === 'string') {
          return `"${expr.value}"`
        }
        return String(expr.value)

      case 'field':
        return expr.name

      case 'self':
        return 'self'

      case 'function':
        return `${expr.name}(${expr.args.map((a) => this.printExpression(a)).join(', ')})`

      case 'object':
        return this.printObject(expr, indent)

      case 'member':
        return `${this.printExpression(expr.object)}.${expr.property}`

      case 'binary':
        return this.printCondition(expr)

      default:
        throw new Error(`Unsupported expression type ${expr satisfies never}`)
    }
  }

  private printObject(expr: ObjectExpression, indent: number): string {
    let output = '{\n'

    for (const [key, value] of Object.entries(expr.value)) {
      output += this.indent(indent + 1)
      output += `"${key}": ${this.printExpression(value, indent + 1)},\n`
    }

    output += this.indent(indent) + '}'

    return output
  }

  private indent(level: number): string {
    return '  '.repeat(level)
  }
}
