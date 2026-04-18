import { ipc } from '@/ipc'
import { AddWatchPlanDTO, UpdateWatchPlanDTO } from '@shared/types/features'

export async function getWatchPlans() {
  return ipc.client.watchPlans.get()
}

export async function addWatchPlan(watchplan: AddWatchPlanDTO) {
  return ipc.client.watchPlans.add(watchplan)
}

export async function removeWatchPlan(ids: number[]) {
  return ipc.client.watchPlans.remove(ids)
}

export async function updateWatchPlan(watchplan: UpdateWatchPlanDTO) {
  return ipc.client.watchPlans.update(watchplan)
}
