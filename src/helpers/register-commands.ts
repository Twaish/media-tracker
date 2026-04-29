import { commands } from './commands'
import { useCommandStore } from '@/app/commandpalette/stores/commandStore'

useCommandStore.getState().register(commands)
