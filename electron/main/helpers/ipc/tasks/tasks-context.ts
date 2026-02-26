import {
  Task,
  TaskCallback,
  TaskDetails,
  TaskProgress,
  TasksContext,
} from '@shared/types/tasks'
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

  const context: TasksContext = {
    onTaskAdded(callback: TaskCallback) {
      return createSubscriptionWithCleanup(TASKS_ON_TASK_ADDED, callback)
    },
    onTaskProgress(callback: TaskCallback) {
      return createSubscriptionWithCleanup(TASKS_ON_TASK_PROGRESS, callback)
    },
    getTasks() {
      return ipcRenderer.invoke(TASKS_GET_TASKS)
    },
    addTask(details: TaskDetails) {
      return ipcRenderer.invoke(TASKS_ADD_TASK, details)
    },
    progressTask(id: string, progress: TaskProgress) {
      return ipcRenderer.invoke(TASKS_PROGRESS_TASK, id, progress)
    },
  }
  contextBridge.exposeInMainWorld('tasks', context)
}
