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

## Feature Todo List
- Create splash screen (Fixes FOUC)
- Automatically fill information of media by link using AI
- Add summary to current episode using AI (Continue without missing context)
- Export/Import to json/csv
- Viewing statistics
- System tray icon UI for quickly updating progress or adding new media
- Backup/Restore using versioning system (delta-based)
- Quick action menu
- Full keyboard navigable
- Cloud sync
- User defined fields with type system
- Rule engine. Run automation on conditions.
- Settings
- Plugin system
- CLI
- Encrypted storage/libraries

## Features
Features that have been implemented in the main process
- AI compatibility (Check for local Ollama)
- External link schema for auto interpolating episodes to URI: `http://comics.com/comics/123456&chapter={{chapter}}`
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
- Watch plans (Ex. Steins;Gate (2011) 1-22, Steins;Gate 0 (2018) 1-23, Steins;Gate (2011) 23-24, ...)
- Soft delete
- Bulk edit
- Duplicate media detection
- Fuzzy searching (Cosine similarity)
- Rule engine DSL compiler 
```
TEMPLATE LogMediaActivity
PARAMETERS { 
  media 
}
DO {
  call http(config("discord.logs.url")) { // resolves value from settings
    METHOD post
    BODY {
      "title": media.title,
      "status": media.status,
      "completedAt": now()
    }
    HEADERS {
      "Authorization": concat("Bearer ", secret("discordToken")) // resolves value from secrets 
    }
    RETRY 3 EXPONENTIAL DELAY 1000
  }
}
--->
{
  type: "template",
  name: "LogMediaActivity",
  parameters: ["media"]
  requires: {
    config: ["discord.logs.url"],
    secrets: ["discordToken"]
  },
  actions: [
    { 
      type: "http",
      url: { 
        type: "function",
        name: "config",
        args: [
          { type: "literal", value: "discord.logs.url" }
        ]
      },
      method: "POST",
      body: {
        type: "object",
        value: {
          title: { type: "field", path: "media.title" },
          status: { type: "field", path: "media.status" },
          completedAt: { type: "function", name: "now", args: [] }
        }
      },
      headers: {
        type: "object",
        value: {
          "Authorization": {
            type: "function",
            name: "concat",
            args: [
              { type: "literal", value: "Bearer " },
              {
                type: "function",
                name: "secret",
                args: [
                  { type: "literal", value: "discordToken" }
                ]
              }
            ]
          }
        }
      }
      retry: {
        attempts: 3, 
        strategy: "exponential", 
        delayMs: 1000
      }
    }
  ]
}

RULE autoCompleteOnFinish
ON media currentEpisode >= maxEpisodes
PRIORITY 1 // Run before others
DO {
  set completedAt = now()
  set status = "Completed"
  add tag = "Finished"
  call template("LogMediaActivity")
  call plugin("obsidian.sync")
}
--->
{
  id: "rule.autoCompleteOnFinish",
  type: "rule",
  priority: 1,
  enabled: true,
  condition: {
    type: "binary",
    operator: ">=",
    left: { type: "field", name: "currentEpisode" },
    right: { type: "field", name: "maxEpisodes" }
  },
  execution: "sequential",
  actions: [
    { type: "set", field: "completedAt", value: { type: "function", name: "now", args: [] } },
    { type: "set", field: "status", value: { type: "literal", value: "Completed" } },
    { type: "append", field: "tag", value: { type: "literal", value: "Finished" } },
    { type: "template", name: "LogMediaActivity", args: { media: { type: "self" } } },
    { type: "plugin", name: "obsidian.sync", args: { media: { type: "self" } } }
  ]
}
```