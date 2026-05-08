# OpenCode Presentations Skill v2.0.0 - Agent Instructions

## Entry Point

```bash
node presentations/bin/present <command> [args]
```

## Quick Commands

| Command | Description |
|---------|-------------|
| `present create "Title"` | Create presentation (launches wizard if no title) |
| `present wizard` | Launch interactive wizard |
| `present build file.md` | Build HTML |
| `present preview file.md` | Live preview (port 3000) |
| `present serve file.md` | Serve with Marp (port 8080) |
| `present styles` | List 20 styles |
| `present sizes` | List slide sizes |
| `present chart bar "data"` | Chart template |
| `present carousel --type=coverflow` | Carousel template |
| `present ai-image "prompt"` | AI image (free) |
| `present scrape-styles dribbble` | Scrape design inspiration |

## Design Styles (20)

| Category | Styles |
|----------|--------|
| **Modern** | glassmorphism, neon-cyber, gradient-minimal, isometric, brutalist |
| **Professional** | corporate-blue, executive-dark, clean-white, editorial, academic |
| **Creative** | geometric, paper-cutout, watercolor, retro, pop-art |
| **Tech** | terminal, blueprint, data-viz, dev-tools, saas-dashboard |

## Slide Sizes

`16:9` (1920×1080), `4:3` (1440×1080), `1:1` (1080×1080), `9:16` (1080×1920), `21:9` (2560×1080)

## Wizard Features

Interactive prompts for:
- Presentation title
- Theme selection (Professional/Modern)
- Style from 20 options (grouped by category)
- Slide size (5 options with dimensions)
- Output format (HTML/PDF/Both)
- Preview mode (Live/Once/None)

## Quality Checking

```bash
node -e "import('./presentations/lib/quality-checker.js').then(m => console.log(m.generateReport(m.analyzePresentation(require('fs').readFileSync('file.md', 'utf-8')))))"
```

8 quality criteria: Single Idea, Visual Hierarchy, Whitespace, Color Palette, Typography, Mobile-First, Consistency, Accessibility.

## Options

| Option | Description |
|--------|-------------|
| `--theme=modern\|professional` | Choose base template |
| `--style=<name>` | Apply design style |
| `--size=16:9\|4:3\|1:1\|9:16\|21:9` | Set slide dimensions |
| `--port=<number>` | Set server port |

## Implementation Details

- **ESM package** (`"type": "module"` in package.json)
- **Path resolution**: Uses `resolve()` for machine-independent paths
- **Marp location**: `node_modules/.bin/marp`
- **Error handling**: Input validation on all commands
- **Wizard**: Uses Node.js `readline` for interactive prompts

## Directory Structure

```
presentations/
├── bin/
│   ├── present        # CLI entry point
│   └── wizard.js      # Interactive wizard
├── lib/
│   ├── preview-server.js
│   ├── scraper.js
│   ├── ai-image.js
│   ├── quality-checker.js
│   └── quality-visual.js
├── styles/            # 20 CSS style files
└── templates/         # Base markdown templates

tests/
├── run-tests.js      # Functional test suite (20 tests, 100% pass)
├── wizard-stress-test.js  # Stress tests (5 scenarios, 185 cases)
├── quality-checker-test.js  # Unit tests for quality checker
└── quality-visual-demo.js  # Visual demo script

results/              # Test reports (auto-generated)
```

## Testing

```bash
# Run functional tests
node tests/run-tests.js

# Run quality checker tests
node tests/quality-checker-test.js

# Run wizard stress tests
node tests/wizard-stress-test.js

# Run visual demo
node tests/quality-visual-demo.js
```

## OpenCode Integration

```json
"plugin": ["presentations@git+https://github.com/molhamfetnah/opencode-presentations-skill.git"]
```