type DiffResult = Record<string, unknown>

export function deepDiff(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): DiffResult {
  const result: DiffResult = {}

  const keys = new Set([...Object.keys(before), ...Object.keys(after)])

  for (const key of keys) {
    const beforeValue = before[key]
    const afterValue = after[key]

    if (Array.isArray(beforeValue) && Array.isArray(afterValue)) {
      const beforeIds = beforeValue.map((v: { id: string }) => v.id)
      const afterIds = afterValue.map((v: { id: string }) => v.id)

      const added = afterIds.filter((id) => !beforeIds.includes(id))
      const removed = beforeIds.filter((id) => !afterIds.includes(id))

      if (added.length > 0 || removed.length > 0) {
        result[key] = {
          ...(added.length > 0 && { added }),
          ...(removed.length > 0 && { removed }),
        }
      }
    } else if (typeof afterValue === 'object' && afterValue !== null) {
      const nestedDiff = deepDiff(
        (beforeValue as Record<string, unknown>) || {},
        (afterValue as Record<string, unknown>) || {},
      )
      if (Object.keys(nestedDiff).length > 0) {
        result[key] = nestedDiff
      }
    } else if (beforeValue !== afterValue) {
      result[key] = beforeValue
    }
  }

  return result
}
