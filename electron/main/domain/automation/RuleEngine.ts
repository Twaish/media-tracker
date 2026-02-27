import { RuleEngineCompiler } from './RuleEngineCompiler'
import { RuleEnginePrinter } from './RuleEnginePrinter'
import { Rule, Template } from './types'

export class RuleEngine {
  constructor(
    private readonly compiler: RuleEngineCompiler,
    private readonly printer: RuleEnginePrinter,
  ) {}

  compile(source: string): Template | Rule {
    return this.compiler.compile(source)
  }

  print(node: Template | Rule) {
    return this.printer.print(node)
  }
}
