# OpenCode Presentations Skill - Enhanced Features Spec

> **Version:** 2.0.0
> **Date:** 2026-05-08
> **Repository:** https://github.com/molhamfetnah/opencode-presentations-skill

---

## Overview

This spec covers major enhancements to the presentations skill including modern carousel designs, multiple sizes, 20 default styles, chart support, web scraping, AI image generation, and live preview.

## Technology Choices

| Feature | Choice | Reason |
|---------|--------|--------|
| Charts | ApexCharts | Richer chart types, better animations |
| AI Images | Nano Banana API | Fast, high quality |
| Web Scraping | Puppeteer | JS execution, SPA support |
| Live Preview | Custom server | Real-time HTML/CSS/JS editing |

---

## 1. Carousel Designs

### Types

1. **Cover Flow** — 3D perspective sliding carousel
2. **Card Stack** — Stacked cards with depth effect
3. **Parallax** — Background parallax scrolling
4. **Cover Reveal** — Content reveal on hover
5. **Timeline** — Horizontal timeline progression

### Implementation

- CSS Grid/Flexbox based
- Hardware-accelerated transforms
- Touch/swipe support
- Keyboard navigation

---

## 2. Multiple Sizes

### Supported Sizes

| Name | Dimensions | Aspect Ratio |
|------|------------|--------------|
| `16:9` | 1920x1080 | 16:9 (default) |
| `4:3` | 1440x1080 | 4:3 |
| `1:1` | 1080x1080 | Square |
| `9:16` | 1080x1920 | Vertical/Stories |
| `21:9` | 2560x1080 | Ultrawide |

---

## 3. 20 Default Design Styles

### Style Categories

**Modern (5)**
1. Glassmorphism — Frosted glass effects, blur, transparency
2. Neon Cyber — Glowing neon, dark backgrounds, cyberpunk
3. Gradient Minimal — Smooth gradients, clean typography
4. Isometric — 3D isometric elements, shadow depth
5. Brutalist — Bold typography, raw aesthetic

**Professional (5)**
6. Corporate Blue — Business style, blue tones
7. Executive Dark — Premium dark with gold accents
8. Clean White — Minimalist white space
9. Editorial — Magazine-style layouts
10. Academic — Clean, structured, citation-ready

**Creative (5)**
11. Geometric — Triangle/polygon patterns
12. Paper Cutout — Layered paper aesthetic
13. Watercolor — Soft, artistic, flowing
14. Retro — 70s/80s vintage style
15. Pop Art — Bold colors, comic style

**Tech (5)**
16. Terminal — Code-inspired, monospace
17. Blueprint — Technical drawing style
18. Data Viz — Charts-focused layouts
19. Dev Tools — IDE-inspired dark theme
20. SaaS Dashboard — Card-based, metric focus

---

## 4. Chart Support

### Chart Types

- Bar charts (horizontal/vertical)
- Line charts (single/multi)
- Pie/Donut charts
- Area charts
- Radar/Spider charts
- Gantt charts
- Gauge/Meter charts

### Implementation

- ApexCharts library integration
- Markdown directive syntax: `<!-- chart:bar data=... -->`
- Auto-responsive sizing
- Theme-aware coloring

---

## 5. Web Scraping for Design Styles

### Scrape Targets

- Dribbble popular shots
- Behance featured
- CSS Awards
- Awwwards nominees
- Pinterest boards

### Extraction

- Color palettes
- Typography choices
- Layout patterns
- Animation styles

---

## 6. AI Image Generation

### Nano Banana API Integration

- Generate slide backgrounds
- Create custom illustrations
- Generate decorative elements
- Style transfer

### Directives

```markdown
<!-- ai-image: prompt="futuristic city skyline" size=1920x1080 -->
```

---

## 7. Live Preview

### Features

- Real-time HTML/CSS editing
- Component previews
- Style switching
- Responsive testing
- Auto-reload on change

### Implementation

- Express-based dev server
- WebSocket for hot reload
- Split view: code + preview

---

## 8. Direct HTML/CSS/JS Support

### Capabilities

- Inline HTML blocks
- Custom CSS in style tags
- JavaScript for interactivity
- Web components support

### Syntax

```markdown
<!-- html -->
<div class="custom-component">
  <h1>Custom HTML</h1>
</div>

<!-- css -->
<style>
.custom-component { color: blue; }
</style>

<!-- js -->
<script>
document.querySelector('.custom-component').onclick = () => alert('clicked!');
</script>
```

---

## CLI Commands (Enhanced)

```bash
# Create with specific style
present create "My Talk" --theme=modern --style=glassmorphism --size=16:9

# Build with charts
present build talk.md --charts

# Serve with live preview
present preview talk.md --port=3000

# Scrape design styles
present scrape dribbble --count=20 --output=styles.json

# Generate AI image
present ai-image "futuristic city" --output=background.png

# Export to specific format
present export talk.md --format=html --style=neon
```

---

## File Structure

```
presentations/
├── bin/present              # Main CLI
├── templates/               # Base templates
│   ├── professional.md
│   ├── modern.md
│   └── ... (20 styles)
├── styles/                  # CSS style definitions
│   ├── glassmorphism.css
│   ├── neon-cyber.css
│   └── ...
├── components/             # Reusable components
│   ├── charts.js
│   ├── carousel.js
│   └── ...
├── lib/                     # Utilities
│   ├── scraper.js          # Puppeteer scraper
│   ├── ai-image.js         # Nano Banana client
│   └── preview-server.js   # Live preview server
└── SKILL.md
```

---

## Dependencies (Updated)

```json
{
  "dependencies": {
    "@marp-team/marp-cli": "^4.0.0",
    "apexcharts": "^4.0.0",
    "puppeteer": "^22.0.0",
    "nano-banana": "^1.0.0",
    "express": "^4.18.0",
    "ws": "^8.0.0",
    "chokidar": "^3.5.0"
  }
}
```

---

## Priority Order

1. ✅ Enhanced CLI with new commands
2. ✅ 20 CSS design styles
3. ✅ Live preview server
4. ✅ Chart support with ApexCharts
5. ✅ Direct HTML/CSS/JS blocks
6. ✅ Multiple slide sizes
7. ✅ Carousel component designs
8. ⏳ Web scraping for styles
9. ⏳ AI image generation (Nano Banana)