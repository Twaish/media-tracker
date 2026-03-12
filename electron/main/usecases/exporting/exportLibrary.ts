import { ExportManager } from '@/infrastructure/exporting/ExportManager'

/*
TODO: SWITCH TO DIFFERENT EXPORTING SCHEMA
Use a folder instead as images also need to be included.
Folder name format: export-{unixtime}
Files:
- manifest.json
- data/{rules.ndjson, ruleEvents.ndjson, ...}
- assets/{thumbnails/{media1.webp, media2.webp, ...}, ...}

Manifest contains:
{
  "version": 1,
  "exportedAt": "2026-03-11T12:00:00Z",
  "appVersion": "1.4.0"
}
*/

export default class ExportLibrary {
  constructor(private readonly exportManager: ExportManager) {}

  async execute(path: string) {
    return this.exportManager.export(path)
  }
}
