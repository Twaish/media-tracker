# Media Tracker
Bootstrapped with Electron + ShadCN template from https://github.com/LuanRoger/electron-shadcn

## Install
```bash
# Clone the repository
git clone https://github.com/Twaish/media-tracker.git your-project-name

# Navigate to the project
cd your-project-name

# Install dependencies
npm i
```

## Release
```bash
# Initialize the database
npm run db:generate

# Build the release file
npm run build:release
```

## Features
### Core Functionality
- **DSL Search**: `<title?> [property operator value[, value...]]*`. Supported operators: `=  !=  <  <=  >  >=`. Example:
  ```js
  // The query:
  // `One Punch Man [genre=Comedy, Fighting][genre!=Thriller][year>=2015]` 
  // would result in:
  // AST Representation
  const query = {
    "title": "One Punch Man",
    "filters": [
      { "field": "genre", "op": "=", "values": ["Comedy", "Fighting"] },
      { "field": "genre", "op": "!=", "values": ["Thriller"] },
      { "field": "year", "op": ">=", "values": [2015] }
    ]
  }
  ```
- **Fuzzy Search**: Cosine similarity based
- **Duplicate Detection**: Using embeddings

### Automation & Extensibility
- **Rule Engine**: Run automations on conditions
- **Rule DSL**: Rules defined in the DSL will compile to ASTs for the rule engine (See examples in `./examples/rules-and-templates.txt`)
- **Plugin System**: Add plugins to the app. See examples in `./examples/Test Plugin`
- **Plugin Sandbox**: Control plugin permissions by restricting access to modules
- **Import/Export System**: Package-based with manifest + resources

### Media Management
- **Watch plans**: (Ex. `Steins;Gate (2011) 1-22`, `Steins;Gate 0 (2018) 1-23`, `Steins;Gate (2011) 23-24`, ...)
- **External Link Templates**: Auto interpolate episodes to URI: `http://comics.com/comics/123456&chapter={{chapter}}`
- **AI Metadata Enrichment**: Autofill media data from links
- **Viewing statistics**: Simple episode change tracking

## Todo List
- Create splash screen (Fixes FOUC)
- System tray icon UI for quickly updating progress or adding new media
- Backup/Restore using versioning system (delta-based)
- Quick action menu
- Full keyboard navigable
- Cloud sync
- User defined fields with type system
- CLI
- Encrypted storage/libraries
- Add index file support for prefilling anime meta data (https://github.com/manami-project/anime-offline-database)
- Add catalog showcasing entries in individual index files with pagination
- Add more media metadata fields for (https://github.com/manami-project/anime-offline-database)