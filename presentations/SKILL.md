# presentations

Generate professional presentations (HTML slides) from Markdown using Marp with enhanced features.

## When to Use

Use this skill when you need to create presentations, slide decks, or slideshow content with modern designs.

## Invocation

```
/present <command> [args]
```

## Commands

### create <title> [--theme=professional|modern] [--style=<name>] [--size=<size>]
Create new presentation markdown file with template.

**Options:**
- `--theme=professional|modern` — Base theme (default: professional)
- `--style=<name>` — Apply one of 20 design styles
- `--size=16:9|4:3|1:1|9:16|21:9` — Slide size (default: 16:9)

### build <file.md>
Build HTML from markdown file.

### serve <file.md> [--port=8080]
Serve HTML presentation locally with live preview.

### preview <file.md> [--port=3000]
Live preview with hot reload — edit markdown and see changes instantly.

### ai-generate <topic>
Get guidance for AI-assisted presentation creation.

### list
List all markdown files in current directory.

### styles
List all 20 available design styles.

### sizes
List all available slide sizes.

### chart <type> [data]
Generate chart template.

**Types:** bar, line, pie, donut, area, radar

### carousel --type=<type>
Generate carousel template.

**Types:** coverflow, cardstack, parallax, timeline, horizontal

### scrape-styles <source> [--count=10] [--output=file.json]
Scrape design styles from web sources.

**Sources:** dribbble, behance, awwwards

### ai-image "prompt" [--output=image.png]
Generate AI image for presentation.

Uses Nano Banana API (set NANO_BANANA_API_KEY env var) or falls back to Pollinations.ai (free).

### export <file.md> --format=html|pdf [--style=<name>]
Export presentation to HTML or PDF.

## Design Styles (20 Total)

**Modern:**
1. glassmorphism — Frosted glass effects, blur, transparency
2. neon-cyber — Glowing neon, dark backgrounds, cyberpunk
3. gradient-minimal — Smooth gradients, clean typography
4. isometric — 3D isometric elements, shadow depth
5. brutalist — Bold typography, raw aesthetic

**Professional:**
6. corporate-blue — Business style, blue tones
7. executive-dark — Premium dark with gold accents
8. clean-white — Minimalist white space
9. editorial — Magazine-style layouts
10. academic — Clean, structured, citation-ready

**Creative:**
11. geometric — Triangle/polygon patterns
12. paper-cutout — Layered paper aesthetic
13. watercolor — Soft, artistic, flowing
14. retro — 70s/80s vintage style
15. pop-art — Bold colors, comic style

**Tech:**
16. terminal — Code-inspired, monospace
17. blueprint — Technical drawing style
18. data-viz — Charts-focused layouts
19. dev-tools — IDE-inspired dark theme
20. saas-dashboard — Card-based, metric focus

## Slide Sizes

| Size | Dimensions | Use Case |
|------|------------|----------|
| 16:9 | 1920x1080 | Default, widescreen |
| 4:3 | 1440x1080 | Traditional |
| 1:1 | 1080x1080 | Social, Instagram |
| 9:16 | 1080x1920 | Vertical, Stories |
| 21:9 | 2560x1080 | Ultrawide |

## Examples

```bash
# Create presentation with specific style and size
present create "My Talk" --style=neon-cyber --size=16:9

# List all available styles
present styles

# Live preview with hot reload
present preview talk.md --port=3000

# Generate chart template
present chart bar "Sales,Revenue,Profit"

# Scrape design inspiration
present scrape-styles dribbble --count=20 --output=inspiration.json

# Generate AI image
present ai-image "futuristic city skyline at sunset"

# Export with custom style
present export talk.md --format=pdf --style=executive-dark
```

## Direct HTML/CSS/JS Support

Add custom HTML, CSS, or JavaScript to slides:

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

## Chart Support (ApexCharts)

```markdown
<!-- chart:bar data="Q1:100,Q2:150,Q3:200,Q4:180" -->
```

## Live Preview

The `preview` command provides:
- Real-time HTML/CSS editing
- Component previews
- Style switching
- Auto-reload on change
- WebSocket hot reload

## Tool Mapping

- Bash → Execute CLI commands (presentations/bin/present)
- Write/Edit → File operations for slide content
- Glob/Read → File discovery