import { ipcMain } from 'electron'
import { Modules } from '../types'
import {
  TASKS_ADD_TASK,
  TASKS_GET_TASKS,
  TASKS_ON_TASK_ADDED,
  TASKS_ON_TASK_PROGRESS,
  TASKS_PROGRESS_TASK,
} from './tasks-channels'
import { Task, TaskDetails, TaskProgress } from '@shared/types/tasks'

export function addTasksEventListeners({ window, TaskService }: Modules) {
  ipcMain.handle(TASKS_ADD_TASK, (_, taskDetails: TaskDetails) => {
    return TaskService.addTask(taskDetails)
  })
  ipcMain.handle(TASKS_GET_TASKS, () => {
    return TaskService.getTasks()
  })
  ipcMain.handle(
    TASKS_PROGRESS_TASK,
    (_, id: string, progress: TaskProgress) => {
      return TaskService.updateTaskProgress(id, progress)
    },
  )
  TaskService.on('taskAdded', (task: Task) => {
    window.webContents.send(TASKS_ON_TASK_ADDED, task)
  })
  TaskService.on('taskProgress', (task: Task) => {
    window.webContents.send(TASKS_ON_TASK_PROGRESS, task)
  })
}
