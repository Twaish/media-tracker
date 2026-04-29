import { create } from 'zustand'
import { v4 } from 'uuid'
import { Command } from '../types'
import { immer } from 'zustand/middleware/immer'

type CommandState = {
  commands: Record<string, Command>
  scopes: Record<string, string>
  register: (input: Command | Command[]) => void
  getAll: () => Command[]
  getFiltered: (query: string, scope: string) => Record<string, Command[]>
}

export const useCommandStore = create<CommandState>()(
  immer((set, get) => {
    return {
      commands: {},
      scopes: { all: 'all' },

      register: (input) =>
        set((s) => {
          const cmds = Array.isArray(input) ? input : [input]
          for (const cmd of cmds) {
            s.commands[v4()] = cmd
            s.scopes[cmd.scope] = cmd.scope
          }
        }),

      getAll: () => Array.from(Object.values(get().commands)),

      getFiltered: (query, scope) => {
        const q = query.toLowerCase().trim()
        const result: Record<string, Command[]> = {}

        Object.values(get().commands).forEach((cmd) => {
          if (scope !== 'all' && cmd.scope !== scope) return
          if (
            q &&
            !cmd.title.toLowerCase().includes(q) &&
            !cmd.desc.toLowerCase().includes(q)
          )
            return
          ;(result[cmd.scope] ??= []).push(cmd)
        })

        return result
      },
    }
  }),
)
