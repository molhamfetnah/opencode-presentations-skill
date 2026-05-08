# presentations

Enhanced presentation generator for OpenCode with 20 styles, carousels, charts, AI images, and live preview.

## Invocation

```
/present <command> [args]
```

## Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `create <title>` | Create new presentation |
| `build <file.md>` | Build HTML from markdown |
| `serve <file.md>` | Serve presentation locally |
| `preview <file.md>` | Live preview with hot reload |
| `list` | List .md files |
| `ai-generate <topic>` | AI creation guidance |
| `export <file.md>` | Export to HTML/PDF |

### Style & Content Commands

| Command | Description |
|---------|-------------|
| `styles` | List 20 design styles |
| `sizes` | List slide sizes |
| `chart <type> [data]` | Generate chart template |
| `carousel --type=<type>` | Generate carousel template |
| `scrape-styles <source>` | Scrape design inspiration |
| `ai-image "prompt"` | Generate AI image |

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--theme` | professional, modern | professional | Base theme |
| `--style` | 20 style names | default | Design style |
| `--size` | 16:9, 4:3, 1:1, 9:16, 21:9 | 16:9 | Slide size |
| `--port` | number | 8080/3000 | Server port |
| `--format` | html, pdf | html | Export format |
| `--output` | filename | varies | Output file |
| `--count` | number | 10 | Item count |

## Design Styles (20 Total)

**Modern:** glassmorphism, neon-cyber, gradient-minimal, isometric, brutalist
**Professional:** corporate-blue, executive-dark, clean-white, editorial, academic
**Creative:** geometric, paper-cutout, watercolor, retro, pop-art
**Tech:** terminal, blueprint, data-viz, dev-tools, saas-dashboard

## Slide Sizes

| Size | Dimensions | Use Case |
|------|------------|----------|
| 16:9 | 1920x1080 | Default, widescreen |
| 4:3 | 1440x1080 | Traditional |
| 1:1 | 1080x1080 | Social, Instagram |
| 9:16 | 1080x1920 | Vertical, Stories |
| 21:9 | 2560x1080 | Ultrawide |

## Carousel Types

`coverflow`, `cardstack`, `parallax`, `timeline`, `horizontal`

## Chart Types

`bar`, `line`, `pie`, `donut`, `area`, `radar`, `gauge`

## Examples

```bash
# Create presentation
present create "My Talk" --style=neon-cyber --size=16:9

# Live preview
present preview talk.md --port=3000

# List styles
present styles

# Generate AI image
present ai-image "futuristic city"

# Scrape design inspiration
present scrape-styles dribbble --count=20

# Export to PDF
present export talk.md --format=pdf
```

## Dependencies

- @marp-team/marp-cli — HTML/PDF generation
- apexcharts — Chart support
- express, ws, chokidar — Live preview
- puppeteer — Web scraping (optional)

## Environment Variables

- `NANO_BANANA_API_KEY` — For AI image generation (optional, falls back to free Pollinations.ai)