import { v4 as uuidv4 } from 'uuid'
import EventEmitter from 'events'
import { Task, TaskDetails, TaskProgress } from '@shared/types'

export class TaskService extends EventEmitter {
  private readonly tasks: Record<string, Task> = {}
  getTasks(): Record<string, Task> {
    return this.tasks
  }
  addTask(task: TaskDetails): Task {
    if (!task.label) {
      throw new Error(`Task is required to have a label`)
    }

    const { label, description = '' } = task

    const id = uuidv4()

    const newTask: Task = {
      id,
      label,
      description,
      progress: 0,
    }
    this.tasks[id] = newTask
    this.emit('taskAdded', newTask)
    return newTask
  }
  updateTaskProgress(id: string, progress: TaskProgress): Task {
    const task = this.tasks[id]
    if (!task) {
      throw new Error(`Task with id ${id} not found`)
    }

    const updatedTask = {
      ...task,
      ...progress,
    }
    this.tasks[id] = updatedTask
    this.emit('taskProgress', updatedTask)
    return updatedTask
  }
}
