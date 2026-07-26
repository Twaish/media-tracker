export function getPages(current: number, total: number): (number | '...')[] {
  if (total <= 1) return total === 1 ? [1] : []
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const set = new Set<number>()
  set.add(1)
  set.add(total)

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    set.add(i)
  }

  const sorted = Array.from(set).sort((a, b) => a - b)
  const result: (number | '...')[] = []

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...')
    }
    result.push(sorted[i])
  }

  return result
}
