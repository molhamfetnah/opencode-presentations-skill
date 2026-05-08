# Presentations Skill for OpenCode v2.0.0

Enhanced presentation generator with 20 design styles, multiple sizes, carousels, chart support, AI image generation, web scraping, and live preview.

## Overview

This skill provides commands to create, build, and serve presentation slides from Markdown files using the Marp ecosystem with advanced styling capabilities.

## Commands

| Command | Description |
|---------|-------------|
| `create <title>` | Create new presentation with template |
| `build <file.md>` | Convert Markdown to HTML slides |
| `serve <file.md>` | Serve presentation locally |
| `preview <file.md>` | Live preview with hot reload |
| `styles` | List all 20 design styles |
| `sizes` | List slide sizes |
| `chart <type>` | Generate chart template |
| `carousel` | Generate carousel template |
| `ai-image "prompt"` | Generate AI image |
| `scrape-styles` | Scrape design inspiration |
| `export` | Export to HTML/PDF |
| `ai-generate` | AI creation guidance |
| `list` | List .md files |
| `version` | Show version |

## Design Philosophy

1. **MDD (Markdown-Driven Development)** — Create slides from Markdown source
2. **Dual Output** — HTML and PDF-ready via Marp
3. **20 Themed Styles** — Modern, Professional, Creative, Tech categories
4. **Local-First** — No cloud dependencies (free image gen via Pollinations.ai)
5. **Live Preview** — Real-time editing with hot reload
6. **Universal Compatibility** — Works on any machine with Node.js 18+

## Tool Mapping

- Bash → Execute CLI commands (`presentations/bin/present`)
- Write/Edit → File operations for slide content
- Glob/Read → File discovery

## Important Paths

- CLI: `presentations/bin/present`
- Styles: `presentations/styles/*.css`
- Templates: `presentations/templates/*.md`
- Library: `presentations/lib/*.js`
- Components: `presentations/components/*.css`