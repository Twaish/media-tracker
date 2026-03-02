import { Modules } from '../types'
import {
  TASKS_ADD_TASK,
  TASKS_GET_TASKS,
  TASKS_ON_TASK_ADDED,
  TASKS_ON_TASK_PROGRESS,
  TASKS_PROGRESS_TASK,
} from './tasks-channels'
import { Task, TasksContext } from '@shared/types/tasks'
import { registerIpcHandlers } from '../register-ipc-handlers'

export function addTasksEventListeners({ window, TaskService }: Modules) {
  registerIpcHandlers<Omit<TasksContext, 'onTaskAdded' | 'onTaskProgress'>>({
    addTask: [
      TASKS_ADD_TASK,
      (_, taskDetails) => TaskService.addTask(taskDetails),
    ],
    getTasks: [TASKS_GET_TASKS, () => TaskService.getTasks()],
    progressTask: [
      TASKS_PROGRESS_TASK,
      (_, id, progress) => TaskService.updateTaskProgress(id, progress),
    ],
  })
  TaskService.on('taskAdded', (task: Task) => {
    window.webContents.send(TASKS_ON_TASK_ADDED, task)
  })
  TaskService.on('taskProgress', (task: Task) => {
    window.webContents.send(TASKS_ON_TASK_PROGRESS, task)
  })
}
