export type Pagination = {
  page?: number
  limit?: number
}

export type PaginationResult<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalItems: number
  }
}
