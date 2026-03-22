import { RuleNode } from '../../domain/ast/RuleNode'
import { TemplateNode } from '../../domain/ast/TemplateNode'

export interface IRuleEnginePrinter {
  /**
   * Prints the AST representation to DSL equivalent
   *
   * @param node The node to print
   * @returns DSL equivalent for the provided AST node
   */
  print(node: TemplateNode | RuleNode): string
}
