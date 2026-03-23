import { IMediaSimilarityService } from '../application/interfaces/IMediaSimilarityService'
import { IQueryResolver } from '../application/interfaces/IQueryResolver'

export default class SearchMediaEmbeddings {
  constructor(
    private readonly similarityService: IMediaSimilarityService,
    private readonly resolver: IQueryResolver,
  ) {}

  async execute(query: string, model: string) {
    const semanticFields = ['alternateTitles', 'type']

    const { title, filters } = this.resolver.resolve(query)

    const relevantFilters = filters
      .filter((f) => semanticFields.includes(f.field))
      .filter((f) => f.op === '=')

    const filterValues = Object.fromEntries(
      relevantFilters.map((f) => [f.field, f.values]),
    )

    const inputText = this.similarityService.buildText({
      title,
      ...filterValues,
    })

    const similar = await this.similarityService.findTopKSimilar(
      inputText,
      model,
    )

    return similar
  }
}
