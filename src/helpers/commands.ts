import { Command } from '@/app/commandpalette/types'
import { toggleSelectTheme } from '@/app/theme/actions'
import { toggleSelectLanguage } from '@/app/language/actions'
import { togglePluginMenu } from '@/app/plugins/actions'

const scoped = (scope: string, items: Omit<Command, 'scope'>[]) => {
  return items.map((item) => Object.assign(item, { scope }))
}

const actionCommands = scoped('Actions', [
  {
    icon: '▶',
    title: 'Run Script',
    desc: 'Pick a package.json script and execution environment',
    steps: [
      {
        type: 'list',
        name: 'script',
        label: 'Select script',
        placeholder: 'Search scripts',
        options: [
          { icon: '⚡', title: 'dev', desc: 'vite --host', value: 'dev' },
          {
            icon: '📦',
            title: 'build',
            desc: 'tsc && vite build',
            value: 'build',
          },
          {
            icon: '🔍',
            title: 'lint',
            desc: 'eslint src --fix',
            value: 'lint',
          },
          { icon: '🧪', title: 'test', desc: 'vitest run', value: 'test' },
          {
            icon: '👁️',
            title: 'preview',
            desc: 'vite preview',
            value: 'preview',
          },
        ],
      },
      {
        type: 'list',
        name: 'environment',
        label: 'Environment',
        placeholder: 'Filter environments',
        options: [
          {
            icon: '💻',
            title: 'Local',
            desc: 'NODE_ENV=development',
            value: 'local',
          },
          {
            icon: '🧪',
            title: 'Staging',
            desc: 'NODE_ENV=staging',
            value: 'staging',
          },
          {
            icon: '🚀',
            title: 'Production',
            desc: 'NODE_ENV=production',
            value: 'production',
          },
        ],
      },
    ],
  },
])

const settingsCommands = scoped('Settings', [
  {
    icon: '🌐',
    title: 'Change Language',
    desc: 'Change the language of the application',
    steps: [],
    hotkey: 'ctrl+p',
    action: toggleSelectLanguage,
  },
  {
    icon: '🎨',
    title: 'Select theme',
    desc: 'Select a new theme for the application',
    steps: [],
    hotkey: 'ctrl+o',
    action: toggleSelectTheme,
  },
  {
    icon: '🧩',
    title: 'Manage plugins',
    desc: 'Manage plugins for the application',
    steps: [],
    action: togglePluginMenu,
  },
])

const navigationCommands = scoped('Navigation', [
  {
    icon: ':)',
    title: 'Toggle Sidebar',
    desc: 'Expand or collapse the sidebar',
    steps: [],
  },
  {
    icon: ':)',
    title: 'Toggle Bottom Panel',
    desc: 'Expand or collapse the bottom panel',
    steps: [],
  },
])

const fileCommands = scoped('Files', [
  {
    icon: ':)',
    title: 'Export Library',
    desc: 'Export your library to a folder location',
    steps: [],
  },
  {
    icon: ':)',
    title: 'Import Library',
    desc: 'Import a library from a folder location',
    steps: [],
  },
])

const gitCommands = scoped('Git', [
  {
    icon: '⎇',
    title: 'Git Commit & Push',
    desc: 'Stage changes, write a commit message and push',
    steps: [
      {
        type: 'list',
        name: 'file',
        label: 'Stage files',
        placeholder: 'Search changed files',
        options: [
          {
            icon: '~',
            title: 'src/App.tsx',
            desc: 'Modified',
            value: 'App.tsx',
          },
          {
            icon: '+',
            title: 'src/components/Card.tsx',
            desc: 'New file',
            value: 'Card.tsx',
          },
          {
            icon: '~',
            title: 'styles.css',
            desc: 'Modified',
            value: 'styles.css',
          },
          {
            icon: '-',
            title: 'src/old/Legacy.tsx',
            desc: 'Deleted',
            value: 'Legacy.tsx',
          },
        ],
      },
      {
        type: 'input',
        name: 'message',
        label: 'Commit message',
        placeholder: 'feat: describe what changed',
      },
      {
        type: 'list',
        name: 'branch',
        label: 'Push to remote',
        placeholder: 'Select remote branch',
        options: [
          {
            icon: '↑',
            title: 'origin/main',
            desc: 'Default remote branch',
            value: 'origin/main',
          },
          {
            icon: '↑',
            title: 'origin/develop',
            desc: 'Integration branch',
            value: 'origin/develop',
          },
          {
            icon: '↑',
            title: 'origin/staging',
            desc: 'Pre-production branch',
            value: 'origin/staging',
          },
        ],
      },
    ],
    action({
      file,
      message,
      branch,
    }: {
      file: string
      message: string
      branch: string
    }) {
      console.log(`<${branch}> [${file}]: ${message}`)
    },
  },
])

export const commands = [
  ...actionCommands,
  ...settingsCommands,
  ...navigationCommands,
  ...fileCommands,
  ...gitCommands,
] satisfies Command[]
