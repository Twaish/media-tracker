export type Pagination = {
  page?: number
  limit?: number
}

export type PaginationInfo = {
  page: number
  limit: number
  totalPages: number
  totalItems: number
}

export type PaginationResult<T> = {
  data: T[]
  pagination: PaginationInfo
}
