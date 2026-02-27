import { Token, TokenType, KEYWORDS } from './types'

export class Lexer {
  private pos = 0
  private tokens: Token[] = []

  constructor(private input: string) {}

  tokenize(): Token[] {
    while (this.pos < this.input.length) {
      const char = this.peek()

      if (/\s/.test(char)) {
        this.advance()
        continue
      }

      if (char === '{') {
        this.push(TokenType.LBrace, char)
        continue
      }
      if (char === '}') {
        this.push(TokenType.RBrace, char)
        continue
      }
      if (char === '(') {
        this.push(TokenType.LParen, char)
        continue
      }
      if (char === ')') {
        this.push(TokenType.RParen, char)
        continue
      }
      if (char === ',') {
        this.push(TokenType.Comma, char)
        continue
      }
      if (char === '.') {
        this.push(TokenType.Dot, char)
        continue
      }
      if (char === ':') {
        this.push(TokenType.Operator, char)
        continue
      }

      if (char === '"' || char === "'") {
        this.tokens.push(this.readString())
        continue
      }

      if (/[0-9]/.test(char)) {
        this.tokens.push(this.readNumber())
        continue
      }

      if (/[a-zA-Z_]/.test(char)) {
        this.tokens.push(this.readIdentifier())
        continue
      }

      if (/[<>!=]/.test(char)) {
        this.tokens.push(this.readOperator())
        continue
      }

      throw new Error(`Unexpected character: ${char}`)
    }

    this.tokens.push({ type: TokenType.EOF, value: '' })

    return this.tokens
  }

  private readString(): Token {
    const quote = this.advance()
    let value = ''

    while (this.peek() !== quote) {
      value += this.advance()
    }

    this.advance()
    return { type: TokenType.String, value }
  }

  private readNumber(): Token {
    let value = ''
    while (/[0-9]/.test(this.peek())) {
      value += this.advance()
    }
    return { type: TokenType.Number, value }
  }

  private readIdentifier(): Token {
    let value = ''
    while (/[a-zA-Z0-9_.]/.test(this.peek())) {
      value += this.advance()
    }

    if (KEYWORDS.has(value)) {
      return { type: TokenType.Keyword, value }
    }

    return { type: TokenType.Identifier, value }
  }

  private readOperator(): Token {
    let value = this.advance()
    if (this.peek() === '=') {
      value += this.advance()
    }
    return { type: TokenType.Operator, value }
  }

  private push(type: TokenType, value: string) {
    this.tokens.push({ type, value })
    this.advance()
  }

  private peek(): string {
    return this.input[this.pos]
  }

  private advance(): string {
    return this.input[this.pos++]
  }
}
