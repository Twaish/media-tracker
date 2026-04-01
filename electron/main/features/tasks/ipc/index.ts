import { Modules } from '@/helpers/ipc/types'
import { eventIterator, os } from '@orpc/server'
import { MemoryPublisher } from '@orpc/experimental-publisher/memory'
import {
  addTaskInputSchema,
  getTasksOutputSchema,
  progressTaskInputSchema,
  taskSchema,
} from './schemas'
import { Task } from '../application/models/task.model'

const taskAddedPublisher = new MemoryPublisher<{ taskAdded: Task }>()
const taskProgressPublisher = new MemoryPublisher<{ taskProgress: Task }>()

export function createTasksRouters({ TaskService }: Modules) {
  TaskService.on('taskAdded', (task: Task) => {
    taskAddedPublisher.publish('taskAdded', task)
  })
  TaskService.on('taskProgress', (task: Task) => {
    taskProgressPublisher.publish('taskProgress', task)
  })

  return {
    add: os
      .input(addTaskInputSchema)
      .output(taskSchema)
      .handler(({ input }) => TaskService.addTask(input)),
    get: os.output(getTasksOutputSchema).handler(() => TaskService.getTasks()),
    progress: os
      .input(progressTaskInputSchema)
      .output(taskSchema)
      .handler(({ input }) => TaskService.updateTaskProgress(input)),

    onTaskAdded: os.output(eventIterator(taskSchema)).handler(async function* ({
      signal,
    }) {
      const iterator = taskAddedPublisher.subscribe('taskAdded', { signal })
      for await (const payload of iterator) {
        yield payload
      }
    }),

    onTaskProgress: os
      .output(eventIterator(taskSchema))
      .handler(async function* ({ signal }) {
        const iterator = taskProgressPublisher.subscribe('taskProgress', {
          signal,
        })
        for await (const payload of iterator) {
          yield payload
        }
      }),
  }
}
