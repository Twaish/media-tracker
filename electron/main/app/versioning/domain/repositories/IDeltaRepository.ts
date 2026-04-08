import { Pagination, PaginationResult } from '@shared/types'
import { Delta, PersistedDelta } from '../entities/delta'

export interface IDeltaRepository {
  add(delta: Delta): Promise<PersistedDelta>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  get(options?: Pagination): Promise<PaginationResult<PersistedDelta>>
}
