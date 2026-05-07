# OpenCode Presentations Skill

Marp-based presentation generator that creates professional HTML slides from Markdown.

## Installation

```bash
cd /path/to/project
npm install
```

## Usage

```bash
# Create presentation
node presentations/bin/present create "My Talk" --theme=professional

# Build HTML
node presentations/bin/present build my-talk.md

# Serve locally
node presentations/bin/present serve my-talk.md
```

## Commands

- `create <title>` - Create new presentation
- `build <file.md>` - Convert to HTML
- `serve <file.md>` - Serve locally
- `ai-generate <topic>` - AI generation guidance
- `list` - List presentations