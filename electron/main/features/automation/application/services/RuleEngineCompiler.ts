import { RuleNode } from '../../domain/ast/RuleNode'
import { TemplateNode } from '../../domain/ast/TemplateNode'
import { IRuleEngineCompiler } from '../interfaces/IRuleEngineCompiler'
import { Lexer } from './Lexer'
import { Parser } from './Parser'
import { SemanticAnalyzer } from './SemanticAnalyzer'

export class RuleEngineCompiler implements IRuleEngineCompiler {
  compile(source: string): TemplateNode | RuleNode {
    const lexer = new Lexer(source)
    const tokens = lexer.tokenize()

    const parser = new Parser(tokens)
    const ast = parser.parseTopLevel()

    const analyzer = new SemanticAnalyzer()
    return analyzer.enrich(ast)
  }
}
