import { Lexer } from './Lexer'
import { Parser } from './Parser'
import { SemanticAnalyzer } from './SemanticAnalyzer'
import { Rule, Template } from './types'

export class RuleEngineCompiler {
  /**
   * How to define a rule:
   * ```
   * RULE <name>
   * (ON | ONCE) <target> <field/expression> <operator> <field/expression>
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
  compile(source: string): Template | Rule {
    const lexer = new Lexer(source)
    const tokens = lexer.tokenize()

    const parser = new Parser(tokens)
    const ast = parser.parseTopLevel()

    const analyzer = new SemanticAnalyzer()
    return analyzer.enrich(ast)
  }
}
