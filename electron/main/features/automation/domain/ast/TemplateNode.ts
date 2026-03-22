import { Action } from './Action'

export type TemplateNode = {
  type: 'template'
  name: string
  parameters: string[]
  requires?: {
    config?: string[]
    secrets?: string[]
  }
  actions: Action[]
}
