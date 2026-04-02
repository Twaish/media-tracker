import type { AiContext } from '@shared/types'

declare global {
  interface Window {
    ai: AiContext
  }
}
