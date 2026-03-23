import { Task, TaskCallback, TasksContext } from '@shared/types'
import {
  TASKS_ADD_TASK,
  TASKS_GET_TASKS,
  TASKS_ON_TASK_ADDED,
  TASKS_ON_TASK_PROGRESS,
  TASKS_PROGRESS_TASK,
} from './tasks-channels'

export function exposeTasksContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')

  function createSubscriptionWithCleanup(
    event: string,
    callback: TaskCallback,
  ): () => void {
    const listener = (_: unknown, task: Task) => {
      callback(task)
    }

    ipcRenderer.on(event, listener)

    return () => {
      ipcRenderer.removeListener(event, listener)
    }
  }

  contextBridge.exposeInMainWorld('tasks', {
    onTaskAdded: (callback) =>
      createSubscriptionWithCleanup(TASKS_ON_TASK_ADDED, callback),
    onTaskProgress: (callback) =>
      createSubscriptionWithCleanup(TASKS_ON_TASK_PROGRESS, callback),
    getTasks: () => ipcRenderer.invoke(TASKS_GET_TASKS),
    addTask: (details) => ipcRenderer.invoke(TASKS_ADD_TASK, details),
    progressTask: (id, progress) =>
      ipcRenderer.invoke(TASKS_PROGRESS_TASK, id, progress),
  } satisfies TasksContext)
}
