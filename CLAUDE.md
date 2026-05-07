# Presentations Skill for OpenCode

Generate professional presentations (HTML slides) from Markdown using Marp.

## Overview

This skill provides commands to create, build, and serve presentation slides from Markdown files using the Marp ecosystem.

## Commands

- `create <title>` - Create new presentation with template
- `build <file.md>` - Convert Markdown to HTML slides
- `serve <file.md>` - Serve presentation locally with live preview
- `ai-generate <topic>` - Get guidance for AI-assisted creation
- `list` - List all .md files in current directory

## Usage

```bash
# Create presentation
presentations create "My Talk" --theme=professional

# Build HTML
presentations build talk.md

# Serve locally
presentations serve talk.md
```

## Tool Mapping

The skill uses native OpenCode tools:
- Bash → Execute CLI commands (presentations/bin/present)
- Write/Edit → File operations for slide content
- Glob/Read → File discovery

## Design Philosophy

1. **MDD (Markdown-Driven Development)** - Create slides from Markdown source
2. **Dual Output** - HTML and PDF-ready via Marp
3. **Themed** - Professional and Modern options
4. **Local-First** - No cloud dependencies