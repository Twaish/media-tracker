import { RuleNode } from '../../domain/ast/RuleNode'
import { TemplateNode } from '../../domain/ast/TemplateNode'

export interface IRuleEngineCompiler {
  /**
   * Compiles DSL defined underneath to an AST
   *
   * How to define a rule:
   * ```
   * RULE <name>
   * FOR <event> [<event>, ...]
   * (ON | ONCE) <target> [<field/expression> <operator> <field/expression>]
   * [PRIORITY <number>]
   * DO { <actions> }
   * ```
   *
   * How to define a template:
   * ```
   * TEMPLATE <name>
   * PARAMETERS { <param> [<param>, ...] }
   * DO { <actions> }
   * ```
   *
   * ### Actions:
   *
   * ```
   * set <field> = <expression>
   * ```
   * ```
   * add <field> = <expression>
   * ```
   * ```
   * call template("<name>")
   * ```
   * ```
   * call plugin("<name>")
   * ```
   * ```
   * call http(<url/expression>) {
   *    METHOD <get|post|put|patch|delete>
   *    BODY { <name>: <expression> [<name>: <expression>, ...] }
   *    HEADERS { <name>: <expression> [<name>: <expression>, ...] }
   *    RETRY <attempts> EXPONENTIAL DELAY <ms>
   * }
   * ```
   */
  compile(source: string): TemplateNode | RuleNode
}
