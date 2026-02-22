import { WatchPlan, WatchPlanSegment } from '@/domain/entities/watchPlan'
import { watchPlansTable } from '@/infrastructure/db/schema'
import { InferInsertModel } from 'drizzle-orm'

export type WatchPlanCreateInput = InferInsertModel<typeof watchPlansTable> & {
  segments: WatchPlanSegment[]
}

export type WatchPlanUpdateInput = Partial<
  Omit<WatchPlanCreateInput, 'id' | 'createdAt'>
> & { id: number; segments: WatchPlanSegment[] }

export interface WatchPlansContext {
  get: () => Promise<WatchPlan[]>
  add: (watchPlan: WatchPlanCreateInput) => Promise<WatchPlan>
  remove: (ids: number[]) => Promise<void>
  update: (media: WatchPlanUpdateInput) => Promise<WatchPlan>
}
