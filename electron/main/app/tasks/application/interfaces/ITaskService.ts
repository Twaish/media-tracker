import { EventEmitter } from 'events'

import { Task } from '../models/task.model'
import { AddTaskDTO, ProgressTaskDTO } from '../dto/tasks.dto'

export interface ITaskService extends EventEmitter {
  getTasks(): Record<string, Task>
  addTask(task: AddTaskDTO): Task
  updateTaskProgress(task: ProgressTaskDTO): Task
}
