import { EventEmitter } from 'events'

import { Task } from '../models/task.model'
import { AddTaskDTO } from '../dto/addTask.dto'
import { ProgressTaskDTO } from '../dto/progressTask.dto'

export interface ITaskService extends EventEmitter {
  getTasks(): Record<string, Task>
  addTask(task: AddTaskDTO): Task
  updateTaskProgress(task: ProgressTaskDTO): Task
}
