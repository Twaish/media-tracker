import { consumeEventIterator } from '@orpc/client'
import { Task, AddTaskDTO } from '@shared/types'
import { ipc } from '@/ipc'

export async function getTasks() {
  return ipc.client.tasks.get()
}
export async function addTask(details: AddTaskDTO): Promise<Task> {
  return ipc.client.tasks.add(details)
}
export async function progressTask(
  id: string,
  description: string,
  progress: number,
): Promise<Task> {
  return ipc.client.tasks.progress({ id, description, progress })
}

export type TaskCallback = (task: Task) => void

export function onTaskAdded(callback: TaskCallback) {
  return consumeEventIterator(ipc.client.tasks.onTaskAdded(), {
    onEvent: (task: Task) => callback(task),
    onError: (err) => console.error('onTaskAdded error', err),
  })
}
export function onTaskProgressed(callback: TaskCallback) {
  return consumeEventIterator(ipc.client.tasks.onTaskProgress(), {
    onEvent: (task: Task) => callback(task),
    onError: (err) => console.error('onTaskProgress error', err),
  })
}
