import { Task, TaskDetails, TaskProgress } from '@shared/types'
import { EventEmitter } from 'events'

export interface ITaskService extends EventEmitter {
  getTasks(): Record<string, Task>
  addTask(task: TaskDetails): Task
  updateTaskProgress(id: string, progress: TaskProgress): Task
}
