export class TopKHeap<T> {
  private heap: { item: T; score: number }[] = []

  constructor(private k: number) {}

  push(item: T, score: number) {
    if (this.heap.length < this.k) {
      this.heap.push({ item, score })
      this.heap.sort((a, b) => a.score - b.score)
      return
    }

    if (score <= this.heap[0].score) return

    this.heap[0] = { item, score }
    this.heap.sort((a, b) => a.score - b.score)
  }

  toSortedDescending() {
    return [...this.heap].sort((a, b) => b.score - a.score)
  }
}
