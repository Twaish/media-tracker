import { Lexer } from './Lexer'
import { Parser } from './Parser'
import { SemanticAnalyzer } from './SemanticAnalyzer'
import { Rule, Template } from './types'

export class RuleEngine {
  compile(source: string): Template | Rule {
    const lexer = new Lexer(source)
    const tokens = lexer.tokenize()

    const parser = new Parser(tokens)
    const ast = parser.parseTopLevel()

    const analyzer = new SemanticAnalyzer()
    return analyzer.enrich(ast)
  }
}
