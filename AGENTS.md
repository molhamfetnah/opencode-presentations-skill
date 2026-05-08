# Agents

## Entry Point

```bash
node presentations/bin/present <command> [args]
```

## Quick Commands

| Command | Description |
|---------|-------------|
| `present create "Title"` | Create presentation |
| `present build file.md` | Build HTML |
| `present preview file.md` | Live preview (port 3000) |
| `present styles` | List 20 styles |
| `present sizes` | List slide sizes |
| `present chart bar "data"` | Chart template |
| `present ai-image "prompt"` | AI image (free) |
| `present scrape-styles dribbble` | Scrape styles |

## Design Styles (20)

| Category | Styles |
|----------|--------|
| **Modern** | glassmorphism, neon-cyber, gradient-minimal, isometric, brutalist |
| **Professional** | corporate-blue, executive-dark, clean-white, editorial, academic |
| **Creative** | geometric, paper-cutout, watercolor, retro, pop-art |
| **Tech** | terminal, blueprint, data-viz, dev-tools, saas-dashboard |

## Slide Sizes

`16:9` (1920×1080), `4:3` (1440×1080), `1:1` (1080×1080), `9:16` (1080×1920), `21:9` (2560×1080)

## Implementation Details

- **ESM package** (`"type": "module"` in package.json)
- **Path resolution**: Uses `resolve()` for machine-independent paths
- **Marps location**: `node_modules/.bin/marp`
- **Error handling**: Input validation on all commands
- **Constants**: Version, sizes, styles defined at top

## OpenCode Integration

```json
"plugin": ["presentations@git+https://github.com/molhamfetnah/opencode-presentations-skill.git"]
```

## Directory Structure

```
presentations/
├── bin/present              # CLI entry point
├── templates/               # Base templates
├── styles/                  # 20 CSS styles
├── components/             # CSS components
├── lib/                     # Utilities
│   ├── preview-server.js    # Live preview
│   ├── scraper.js           # Web scraping
│   └── ai-image.js          # AI generation
└── SKILL.md                 # Skill definition
```

## Dependencies

| Package | Purpose | Required |
|---------|---------|----------|
| @marp-team/marp-cli | HTML/PDF | Yes |
| apexcharts | Charts | Yes |
| express, ws, chokidar | Live preview | Yes |
| puppeteer | Web scraping | Optional |

## Verification

```bash
node presentations/bin/present --help
node presentations/bin/present create "Test" && rm test.md
node presentations/bin/present styles
node presentations/bin/present sizes
```

## Environment Variables

```bash
export NANO_BANANA_API_KEY=your_key  # Optional, falls back to free Pollinations.ai
```

## Optional Setup

Web scraping:
```bash
npm install puppeteer
```