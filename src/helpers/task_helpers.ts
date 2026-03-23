import { Task, TaskCallback, TaskDetails, TaskProgress } from '@shared/types'

export async function getTasks() {
  return window.tasks.getTasks()
}
export async function addTask(details: TaskDetails): Promise<Task> {
  return window.tasks.addTask(details)
}
export async function progressTask(
  id: string,
  progress: TaskProgress,
): Promise<Task> {
  return window.tasks.progressTask(id, progress)
}
export function onTaskAdded(callback: TaskCallback) {
  return window.tasks.onTaskAdded(callback)
}
export function onTaskProgressed(callback: TaskCallback) {
  return window.tasks.onTaskProgress(callback)
}
