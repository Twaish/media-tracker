export type TaskDetails = {
  label: string
  description: string
}

export type TaskProgress = {
  description: string
  progress: number
}

export type Task = {
  id: string
} & TaskDetails &
  TaskProgress

export type TaskCallback = (task: Task) => void

export type TaskEventHandler = (callback: TaskCallback) => Function

export interface TasksContext {
  onTaskAdded: TaskEventHandler
  onTaskProgress: TaskEventHandler
  addTask: (details: TaskDetails) => Task
  getTasks: () => Record<string, Task>
  progressTask: (id: string, progress: TaskProgress) => Task
}
