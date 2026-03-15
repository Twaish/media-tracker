import {
  Action,
  AppendAction,
  BinaryExpression,
  Expression,
  FunctionExpression,
  HttpAction,
  HttpMethod,
  LiteralExpression,
  ObjectExpression,
  RuleNode,
  SetAction,
  TemplateNode,
  Token,
  TokenType,
} from './types'

export class Parser {
  private pos = 0
  private currentRuleEntity: string | null = null

  constructor(private tokens: Token[]) {}

  parseTopLevel(): TemplateNode | RuleNode {
    if (this.match('TEMPLATE')) return this.parseTemplate()
    if (this.match('RULE')) return this.parseRule()
    throw new Error('Expected TEMPLATE or RULE')
  }

  private parseTemplate(): TemplateNode {
    this.expectKeyword('TEMPLATE')
    const name = this.expect(TokenType.Identifier).value

    let parameters: string[] = []
    if (this.match('PARAMETERS')) {
      parameters = this.parseParameters()
    }

    this.expectKeyword('DO')
    const actions = this.parseBlock()

    return {
      type: 'template',
      name,
      parameters,
      actions,
    }
  }

  private parseParameters(): string[] {
    this.expectKeyword('PARAMETERS')
    this.expect(TokenType.LBrace)

    const params: string[] = []

    while (!this.check(TokenType.RBrace)) {
      params.push(this.expect(TokenType.Identifier).value)
    }

    this.expect(TokenType.RBrace)
    return params
  }

  // TODO: Allow for no binary conditions and making it execute for every event it listens to
  private parseRule(): RuleNode {
    this.expectKeyword('RULE')
    const name = this.expect(TokenType.Identifier).value

    this.expectKeyword('FOR')
    const events: string[] = []

    do {
      const event = this.expect(TokenType.Identifier).value
      events.push(event)
    } while (this.check(TokenType.Comma) && this.consume())

    const trigger = this.expect(TokenType.Keyword).value
    const entity = this.expect(TokenType.Identifier).value
    this.currentRuleEntity = entity

    const condition = this.parseCondition()

    let priority = 0
    if (this.match('PRIORITY')) {
      this.consume()
      priority = Number(this.expect(TokenType.Number).value)
    }

    this.expectKeyword('DO')
    const actions = this.parseBlock()

    this.currentRuleEntity = null

    return {
      type: 'rule',
      name,
      trigger,
      events,
      target: entity,
      priority,
      enabled: true,
      condition,
      execution: 'sequential',
      actions,
    }
  }

  private parseCondition(): BinaryExpression {
    const left = this.parseExpression()
    const operator = this.expect(TokenType.Operator)
      .value as BinaryExpression['operator']
    const right = this.parseExpression()

    return {
      type: 'binary',
      operator,
      left,
      right,
    }
  }

  private parseBlock(): Action[] {
    this.expect(TokenType.LBrace)
    const actions: Action[] = []

    while (!this.check(TokenType.RBrace)) {
      actions.push(this.parseAction())
    }

    this.expect(TokenType.RBrace)
    return actions
  }

  private parseAction(): Action {
    const token = this.peek()

    if (token.value === 'set') return this.parseSet()
    if (token.value === 'add') return this.parseAdd()
    if (token.value === 'call') return this.parseCall()

    throw new Error(`Unknown action: ${token.value}`)
  }

  private parseSet(): SetAction {
    this.expectKeyword('set')
    const field = this.expect(TokenType.Identifier).value
    this.expect(TokenType.Operator, '=')
    const value = this.parseExpression()
    return { type: 'set', field, value }
  }

  private parseAdd(): AppendAction {
    this.expectKeyword('add')
    const field = this.expect(TokenType.Identifier).value
    this.expect(TokenType.Operator, '=')
    const value = this.parseExpression()
    return { type: 'append', field, value }
  }

  private parseCall(): Action {
    this.expectKeyword('call')

    const fn = this.parseExpression()

    if (fn.type !== 'function') {
      throw new Error('call must invoke function')
    }

    if (fn.name === 'template') {
      return {
        type: 'template',
        name: (fn.args[0] as LiteralExpression).value as string,
        args: this.buildImplicitArgs(),
      }
    }

    if (fn.name === 'plugin') {
      return {
        type: 'plugin',
        name: (fn.args[0] as LiteralExpression).value as string,
        args: this.buildImplicitArgs(),
      }
    }

    if (fn.name === 'http') {
      return this.parseHttp(fn.args[0])
    }

    throw new Error(`Unknown call target: ${fn.name}`)
  }

  private buildImplicitArgs(): Record<string, Expression> {
    if (!this.currentRuleEntity) return {}

    return {
      [this.currentRuleEntity]: { type: 'self' },
    }
  }

  private parseHttp(url: Expression): HttpAction {
    this.expect(TokenType.LBrace)

    let method: HttpMethod = 'GET'
    let body: Expression | undefined
    let headers: Expression | undefined
    let retry: HttpAction['retry']

    while (!this.check(TokenType.RBrace)) {
      if (this.match('METHOD')) {
        this.consume()
        method = this.expect(
          TokenType.Identifier,
        ).value.toUpperCase() as HttpMethod
      } else if (this.match('BODY')) {
        this.consume()
        body = this.parseExpression()
      } else if (this.match('HEADERS')) {
        this.consume()
        headers = this.parseExpression()
      } else if (this.match('RETRY')) {
        this.consume()
        const attempts = Number(this.expect(TokenType.Number).value)
        this.expectKeyword('EXPONENTIAL')
        this.expectKeyword('DELAY')
        const delay = Number(this.expect(TokenType.Number).value)

        retry = {
          attempts,
          strategy: 'exponential',
          delayMs: delay,
        }
      } else {
        throw new Error(`Unexpected token in http block`)
      }
    }

    this.expect(TokenType.RBrace)

    return {
      type: 'http',
      url,
      method,
      body,
      headers,
      retry,
    }
  }

  private parseExpression(): Expression {
    let expr = this.parsePrimary()

    while (this.check(TokenType.Dot)) {
      this.consume()
      const property = this.expect(TokenType.Identifier).value

      expr = {
        type: 'member',
        object: expr,
        property,
      }
    }

    return expr
  }

  private parsePrimary(): Expression {
    const token = this.peek()

    if (token.type === TokenType.String) {
      this.consume()
      return { type: 'literal', value: token.value }
    }

    if (token.type === TokenType.Number) {
      this.consume()
      return { type: 'literal', value: Number(token.value) }
    }

    if (token.type === TokenType.Identifier) {
      return this.parseIdentifierExpression()
    }

    if (token.type === TokenType.LBrace) {
      return this.parseObject()
    }

    throw new Error(`Unexpected token in expression`)
  }

  private parseIdentifierExpression(): Expression {
    const name = this.expect(TokenType.Identifier).value

    if (this.check(TokenType.LParen)) {
      return this.parseFunction(name)
    }

    return { type: 'field', name }
  }

  private parseFunction(name: string): FunctionExpression {
    this.expect(TokenType.LParen)

    const args: Expression[] = []

    while (!this.check(TokenType.RParen)) {
      args.push(this.parseExpression())
      if (this.check(TokenType.Comma)) this.consume()
    }

    this.expect(TokenType.RParen)

    return {
      type: 'function',
      name,
      args,
    }
  }

  private parseObject(): ObjectExpression {
    this.expect(TokenType.LBrace)

    const value: Record<string, Expression> = {}

    while (!this.check(TokenType.RBrace)) {
      const keyToken = this.peek()
      let key: string

      if (
        keyToken.type === TokenType.String ||
        keyToken.type === TokenType.Identifier
      ) {
        this.consume()
        key = keyToken.value
      } else {
        throw new Error(
          `Expected string or identifier as object key, got ${keyToken.value}`,
        )
      }

      this.expect(TokenType.Operator, ':')
      value[key] = this.parseExpression()
      if (this.check(TokenType.Comma)) this.consume()
    }

    this.expect(TokenType.RBrace)

    return { type: 'object', value }
  }

  private match(keyword: string) {
    const token = this.peek()
    return token.type === TokenType.Keyword && token.value === keyword
  }

  private expectKeyword(keyword: string) {
    const token = this.expect(TokenType.Keyword)
    if (token.value !== keyword) {
      throw new Error(`Expected keyword ${keyword}`)
    }
  }

  private expect(type: TokenType, value?: string): Token {
    const token = this.consume()
    if (token.type !== type || (value && token.value !== value)) {
      throw new Error(`Unexpected token: ${token.value}`)
    }
    return token
  }

  private check(type: TokenType) {
    return this.peek().type === type
  }

  private peek(): Token {
    return this.tokens[this.pos]
  }

  private consume(): Token {
    return this.tokens[this.pos++]
  }
}
