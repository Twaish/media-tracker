export type StepOption = {
  icon: string
  title: string
  desc: string
  value: unknown
}

export type Step =
  | {
      type: 'list'
      name: string
      label: string
      placeholder: string
      options: StepOption[]
    }
  | { type: 'input'; name: string; label: string; placeholder: string }

export type Command = {
  icon: string
  title: string
  desc: string
  scope: string
  steps: Step[]
  hotkey?: string
  action?: Function
}

export type StackFrame = {
  command: Command
  stepIndex: number
  collectedValues: string[]
  values: Record<string, string>
}
