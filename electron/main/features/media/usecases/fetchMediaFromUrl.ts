import { IAiService } from '@/features/ai/application/ports/IAiService'
import { AddMediaDTO } from '../application/dto/mediaDto'

export default class FetchMediaFromUrl {
  constructor(private readonly aiService: IAiService) {}

  async execute(url: string, model: string): Promise<AddMediaDTO> {
    const rawContent = await this.aiService.webFetch(url)

    const prompt = `
Extract the following media information from the raw webpage text below.
Respond ONLY with a valid JSON object matching the TypeScript type \`AddMediaDTO\`.
Ensure you do not wrap it in a markdown block, just provide the raw JSON string itself.
The url you will fetch data from is ${url}, this is NOT the anime itself, it is the url of the page you need to extract the data from.

type AddMediaDTO = {
    title: string;
    currentEpisode: number;
    maxEpisodes: number | null;
    thumbnail: string | null;
    type: "anime" | "manga" | "manhwa" | "manhua";
    status: "watching" | "completed" | "on-hold" | "dropped" | "plan-to-watch";
    externalLink: string | null;
    alternateTitles: string | null;
    watchAfter: number | null;
    isFavorite: boolean;
    genres: number[];
}

Extract the genre IDs intelligently (an empty array is fine if none match, but try your best).
Set the \`externalLink\` explicitly to "${url}".

--- RAW WEBPAGE TEXT ---
${rawContent}
`

    return this.aiService.generateJson<AddMediaDTO>(prompt, model)
  }
}
