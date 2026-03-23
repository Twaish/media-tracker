import { Filter, Operator } from '../../domain/query/Filter'
import { SearchQuery } from '../../domain/query/SearchQuery'
import { IQueryResolver } from '../interfaces/IQueryResolver'

export class QueryResolver implements IQueryResolver {
  private readonly OP_REGEX = /(!=|<=|>=|=|<|>)/

  resolve(query: string): SearchQuery {
    const filters: Filter[] = []
    const bracketRegex = /\[(.*?)\]/g
    let match

    while ((match = bracketRegex.exec(query)) !== null) {
      const content = match[1] // The text inside the []
      const parts = content.split(this.OP_REGEX).map((p) => p.trim())

      if (parts.length === 3) {
        const [field, op, rawValues] = parts

        const values = rawValues.split(',').map((v) => {
          const trimmed = v.trim()
          return isNaN(Number(trimmed)) ? trimmed : Number(trimmed)
        })

        filters.push({ field, op: op as Operator, values })
      }
    }

    const title = query
      .replace(bracketRegex, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .join(' ')

    return {
      title,
      filters,
    }
  }
}
