import { Delta, DeltaProps } from '../domain/entities/delta'
import { IDeltaRepository } from '../domain/repositories/IDeltaRepository'

export default class AddDelta {
  constructor(private readonly repo: IDeltaRepository) {}

  async execute(delta: DeltaProps) {
    if (delta.type === 'update') {
      const isTheSame = delta.before === delta.after
      const isMissingUpdates = !delta.after || !delta.before
      if (isTheSame || isMissingUpdates) return
    }

    return this.repo.add(Delta.create(delta))
  }
}
