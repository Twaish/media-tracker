export type AiCompatibilityResultSuccess = {
  available: true
  version: string
  models: string[]
}

export type AiCompatibilityResultFailure = {
  available: false
  error: string
}

export type AiCompatibilityResultDTO =
  | AiCompatibilityResultFailure
  | AiCompatibilityResultSuccess
