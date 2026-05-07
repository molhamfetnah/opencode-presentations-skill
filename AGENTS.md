# Agents

## Entry Point

CLI: `node presentations/bin/present <command> [args]`

## Commands

| Command | Description |
|---------|-------------|
| `present create "Title" --theme=modern --style=neon-cyber --size=16:9` | Create with style/size |
| `present build file.md` | Build HTML from markdown |
| `present serve file.md` | Serve on http://localhost:8080 |
| `present preview file.md` | Live preview with hot reload |
| `present styles` | List all 20 design styles |
| `present sizes` | List 5 slide sizes |
| `present chart bar "data"` | Generate chart template |
| `present carousel --type=coverflow` | Generate carousel template |
| `present scrape-styles dribbble --count=10` | Scrape design styles (needs puppeteer) |
| `present ai-image "prompt" --output=image.png` | AI image (Nano Banana or Pollinations) |
| `present ai-generate "topic"` | Print guidance |
| `present list` | List .md files in cwd |

## Design Styles (20 Total)

**Modern:** glassmorphism, neon-cyber, gradient-minimal, isometric, brutalist
**Professional:** corporate-blue, executive-dark, clean-white, editorial, academic
**Creative:** geometric, paper-cutout, watercolor, retro, pop-art
**Tech:** terminal, blueprint, data-viz, dev-tools, saas-dashboard

## Slide Sizes

`16:9` (1920x1080), `4:3` (1440x1080), `1:1` (1080x1080), `9:16` (1080x1920), `21:9` (2560x1080)

## Important Implementation Details

- **ESM package** (`"type": "module"` in package.json)
- **Local marp binary**: `node_modules/.bin/marp` (not npx/global)
- **Templates**: `presentations/templates/{professional,modern}.md`
- **Styles**: `presentations/styles/{style}.css` (20 styles)
- **Components**: `presentations/components/{carousel,charts}.css`
- **Libraries**: `presentations/lib/{preview-server,scraper,ai-image}.js`
- **Theme parsing**: `--theme=modern`; defaults to `professional`
- **Style parsing**: `--style=<name>`; any existing style file
- **Size parsing**: `--size=16:9`; 5 supported sizes

## OpenCode Integration

```json
"plugin": ["presentations@git+https://github.com/molhamfetnah/opencode-presentations-skill.git"]
```

Files:
- `.opencode/plugin.js` — Skill registration
- `.opencode/INSTALL.md` — Installation instructions
- `node_modules/presentations-skills/SKILL.md` — Skill definition
- `presentations/SKILL.md` — Full skill documentation

## Dependencies

| Package | Purpose |
|---------|---------|
| @marp-team/marp-cli | HTML/PDF generation |
| apexcharts | Chart support |
| express, ws, chokidar | Live preview server |
| puppeteer | Web scraping (optional) |

## No Formal Test/Lint/Type Setup

Verify manually:
```bash
node presentations/bin/present --help
node presentations/bin/present create "Test" && rm test.md
node presentations/bin/present styles
node presentations/bin/present sizes
```

## Web Scraping

Install puppeteer for design scraping:
```bash
npm install puppeteer
```
Sources: dribbble, behance, awwwards

## AI Image Generation

**Free (Pollinations.ai):** No API key needed
```bash
present ai-image "futuristic city" --output=bg.png
```

**Nano Banana API:** Set env var
```bash
export NANO_BANANA_API_KEY=your_key
```
Falls back to Pollinations if not set.

## Live Preview

Start preview server:
```bash
present preview talk.md --port=3000
```
Opens at http://localhost:3000 with:
- Style switching sidebar
- Size selection
- Chart builder
- AI image generator
- WebSocket hot reload

## Carousel Types

`coverflow` — 3D perspective sliding
`cardstack` — Stacked cards with depth
`parallax` — Background parallax scrolling
`timeline` — Horizontal timeline
`horizontal` — Simple horizontal scroll