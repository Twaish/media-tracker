export type EntityEvent<T> = {
  current: T
  previous?: T
  event?: unknown // Optional event metadata
}
