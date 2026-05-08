# OpenCode Presentations Skill v2.0.0

Enhanced Marp-based presentation generator with 20 design styles, carousels, charts, AI images, and live preview.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/molhamfetnah/opencode-presentations-skill.git

# Navigate to project
cd opencode-presentations-skill

# Install dependencies
npm install

# Create your first presentation
node presentations/bin/present create "My Talk" --style=neon-cyber --size=16:9

# Build HTML
node presentations/bin/present build my-talk.md

# Live preview
node presentations/bin/present preview my-talk.md --port=3000
```

## Features

### 20 Design Styles

| Category | Styles |
|----------|--------|
| **Modern** | Glassmorphism, Neon Cyber, Gradient Minimal, Isometric, Brutalist |
| **Professional** | Corporate Blue, Executive Dark, Clean White, Editorial, Academic |
| **Creative** | Geometric, Paper Cutout, Watercolor, Retro, Pop Art |
| **Tech** | Terminal, Blueprint, Data Viz, Dev Tools, SaaS Dashboard |

### 5 Slide Sizes

| Size | Dimensions | Aspect Ratio |
|------|------------|--------------|
| 16:9 | 1920x1080 | Widescreen (default) |
| 4:3 | 1440x1080 | Traditional |
| 1:1 | 1080x1080 | Square |
| 9:16 | 1080x1920 | Vertical/Stories |
| 21:9 | 2560x1080 | Ultrawide |

### Carousel Designs

- Cover Flow — 3D perspective sliding
- Card Stack — Stacked cards with depth
- Parallax — Background parallax scrolling
- Timeline — Horizontal timeline progression
- Horizontal — Simple horizontal scroll

### Chart Support

Built-in templates for ApexCharts:
- Bar, Line, Pie, Donut, Area, Radar, Gauge

### AI Image Generation

**Free (Pollinations.ai):** No API key needed
```bash
present ai-image "futuristic city skyline"
```

**Nano Banana API:** Set env var
```bash
export NANO_BANANA_API_KEY=your_key
```

### Web Scraping

Scrape design inspiration from:
- Dribbble
- Behance
- Awwwards

```bash
present scrape-styles dribbble --count=20 --output=inspiration.json
```

### Live Preview

Real-time preview with hot reload:
```bash
present preview talk.md --port=3000
```

---

## Installation & Integration

### OpenCode Integration

Add to your `opencode.json`:

```json
{
  "plugin": ["presentations@git+https://github.com/molhamfetnah/opencode-presentations-skill.git"]
}
```

### Standalone CLI

```bash
# Add to PATH
export PATH="/path/to/opencode-presentations-skill/presentations/bin:$PATH"

# Or add alias to ~/.zshrc
alias present="node /path/to/opencode-presentations-skill/presentations/bin/present"
```

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `present create "Title"` | Create presentation |
| `present build file.md` | Build HTML |
| `present serve file.md` | Serve locally |
| `present preview file.md` | Live preview |
| `present styles` | List styles |
| `present sizes` | List sizes |
| `present chart bar "data"` | Chart template |
| `present carousel --type=coverflow` | Carousel template |
| `present scrape-styles dribbble` | Scrape inspiration |
| `present ai-image "prompt"` | AI image |
| `present export file.md --format=pdf` | Export PDF |
| `present ai-generate "topic"` | AI guidance |
| `present list` | List .md files |
| `present version` | Show version |

### Options

| Option | Values | Default |
|--------|--------|---------|
| `--theme` | professional, modern | professional |
| `--style` | 20 style names | default |
| `--size` | 16:9, 4:3, 1:1, 9:16, 21:9 | 16:9 |
| `--port` | number | 8080/3000 |
| `--format` | html, pdf | html |

---

## Writing Slides

### Basic Structure

```markdown
---
marp: true
theme: default
size: 16:9
paginate: true
---

# Slide Title

---
## New Slide

Content here...
```

### With Custom Style

```markdown
---
marp: true
theme: default
size: 16:9
style: |
  section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
---

# Title
```

### Chart Directive

```markdown
<!-- chart:bar data="Q1:100,Q2:150,Q3:200,Q4:180" -->
```

### Carousel Directive

```markdown
<!-- carousel:coverflow items="5" -->
## Slide 1
![image](url1)
## Slide 2
![image](url2)
<!-- /carousel -->
```

---

## Project Structure

```
opencode-presentations-skill/
├── package.json
├── presentations/
│   ├── bin/present           # CLI entry point
│   ├── templates/            # Base templates
│   │   ├── professional.md
│   │   └── modern.md
│   ├── styles/              # 20 CSS styles
│   ├── components/          # CSS components
│   │   ├── carousel.css
│   │   ├── charts.css
│   │   └── preview.html
│   ├── lib/                  # Utilities
│   │   ├── preview-server.js
│   │   ├── scraper.js
│   │   └── ai-image.js
│   └── SKILL.md
├── .opencode/               # OpenCode plugin files
├── CLAUDE.md
├── ARCHITECTURE.md
├── IMPLEMENTATION.md
└── README.md
```

---

## Dependencies

| Package | Purpose | Required |
|---------|---------|----------|
| @marp-team/marp-cli | HTML/PDF generation | Yes |
| apexcharts | Chart support | Yes |
| express | Live preview server | Yes |
| ws | WebSocket for hot reload | Yes |
| chokidar | File watching | Yes |
| puppeteer | Web scraping | Optional |

Install optional dependencies:

```bash
npm install puppeteer
```

---

## Troubleshooting

### Marp not found

```bash
npm install
```

### Web scraping fails

```bash
npm install puppeteer
```

### AI images not generating

Set API key or use free alternative:

```bash
export NANO_BANANA_API_KEY=your_key
# OR use free Pollinations.ai (no key needed)
```

---

## License

MIT License - feel free to use and modify!

---

## Questions?

- Open an issue: https://github.com/molhamfetnah/opencode-presentations-skill/issues
- Documentation: See ARCHITECTURE.md and IMPLEMENTATION.md