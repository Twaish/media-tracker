## Install
```bash
# Clone the repository
git clone https://github.com/Twaish/media-tracker.git your-project-name

# Navigate to the project
cd your-project-name

# Install dependencies
npm i
```

## Feature Todo List
- Create splash screen (Fixes FOUC)
- AI compatibility (Check for local Ollama)
- Automatically fill information of media by link using AI
- Add summary to current episode using AI (Continue without missing context)
- Export/Import to json/csv
- Viewing statistics
- Duplicate media detection
- External link schema for auto interpolating episodes to URI: `http://comics.com/comics/123456&chapter={{chapter}}`
- System tray icon UI for quickly updating progress or adding new media
- Backup/Restore using versioning system (delta-based)
- Fuzzy searching (Cosine similarity)
- Quick action menu
- Settings
- Plugin system
- CLI
- Encrypted storage/libraries
- Watch plans (Ex. Steins;Gate (2011) 1-22, Steins;Gate 0 (2018) 1-23, Steins;Gate (2011) 23-24, ...)
- Searching using following schema : `<title?> [property operator value[, value...]]*`. Supported operators: `=  !=  <  <=  >  >=`. Example query: `One Punch Man [genre=Comedy, Fighting][genre!=Thriller][year>=2015]` would result in:
```json
// AST Representation
SearchQuery {
  "title": "One Punch Man",
  "filters": [
    { "field": "genre", "op": "=", "values": ["Comedy", "Fighting"] },
    { "field": "genre", "op": "!=", "values": ["Thriller"] },
    { "field": "year", "op": ">=", "values": [2015] }
  ]
}
```