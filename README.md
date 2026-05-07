# OpenCode Presentations Skill

Marp-based presentation generator that creates professional HTML slides from Markdown.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/molhamfetnah/opencode-presentations-skill.git

# Navigate to the project
cd opencode-presentations-skill

# Install dependencies
npm install

# Create your first presentation
node presentations/bin/present create "My Talk" --theme=professional

# Build HTML slides
node presentations/bin/present build my-talk.html
```

---

## Installation & Integration Guide

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/molhamfetnah/opencode-presentations-skill.git
```

This creates a folder named `opencode-presentations-skill` in your current directory.

### Step 2: Navigate to the Project

```bash
cd opencode-presentations-skill
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs `@marp-team/marp-cli` - the core engine that converts Markdown to HTML slides.

### Step 4: Verify Installation

```bash
node presentations/bin/present --help
```

You should see:

```
Usage: present <command> [options]
Commands:
  create <title> [--theme=professional|modern]
  build <file.md>
  serve <file.md>
  ai-generate <topic>
  list
```

---

## Step-by-Step: Creating Your First Presentation

### Method 1: Interactive Creation

**Step 1:** Create a new presentation file

```bash
node presentations/bin/present create "Introduction to Machine Learning" --theme=professional
```

This creates `introduction-to-machine-learning.md` in your current directory.

**Step 2:** Edit the content

Open the created file in your favorite editor:

```bash
# Using vscode
code introduction-to-machine-learning.md

# Using vim
vim introduction-to-machine-learning.md
```

Replace `{title}` and fill in your content. See [Writing Slides](#writing-slides) below.

**Step 3:** Build HTML slides

```bash
node presentations/bin/present build introduction-to-machine-learning.md
```

This generates `introduction-to-machine-learning.html`.

**Step 4:** Open in browser

```bash
# On Linux
xdg-open introduction-to-machine-learning.html

# On macOS
open introduction-to-machine-learning.html

# On Windows
start introduction-to-machine-learning.html
```

### Method 2: Using AI Assistance

**Step 1:** Get guidance

```bash
node presentations/bin/present ai-generate "Introduction to Machine Learning"
```

**Step 2:** Follow the AI suggestions to outline your presentation

**Step 3:** Create the presentation (Method 1)

---

## Writing Slides

### Basic Structure

Every presentation file starts with Marp directives:

```markdown
---
marp: true
theme: default
class: lead
paginate: true
---

# Slide Title

---

## New Section

- Bullet point 1
- Bullet point 2
- Bullet point 3
```

### Marp Directives

| Directive | Description | Example |
|----------|-------------|---------|
| `marp: true` | Enable Marp processing | Required |
| `theme` | Built-in theme | `default`, `gaia`, `uncover` |
| `class` | Section class | `lead`, `invert` |
| `paginate` | Show slide numbers | `true` |
| `size` | Slide size | `16:9` |
| `style` | Custom CSS | (see below) |

### Slide Separators

Use `---` to separate slides:

```markdown
# Slide 1 Title

---

# Slide 2 Title (new slide)
```

### Example: Professional Theme

```markdown
---
marp: true
theme: default
class: lead
paginate: true
---

# Introduction to Machine Learning

**A Comprehensive Overview**

---

## Agenda

1. What is Machine Learning?
2. Types of Learning
3. Real-world Applications
4. Getting Started

---

## What is Machine Learning?

### Definition

Machine Learning is the study of algorithms that improve automatically through experience.

### Key Concepts

- **Training Data**: Examples used to learn
- **Model**: The learned system
- **Prediction**: Using the model on new data

---

## Types of Learning

### Supervised Learning

- Classification
- Regression

### Unsupervised Learning

- Clustering
- Dimensionality Reduction

---

## Conclusion

- Machine Learning powers modern AI
- Many applications in daily life
- Start learning today!
```

### Example: Modern Theme

```markdown
---
marp: true
theme: default
class: lead
paginate: true
style: |
  section.lead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  section {
    background: #f8f9fa;
  }
  section h1, section h2 {
    color: #2c3e50;
  }
  section li {
    color: #34495e;
  }
---

# Introduction to Machine Learning

**A Modern Approach**

---

## Agenda

1. What is ML?
2. Key Concepts
3. Applications
4. Next Steps

---

## What is ML?

Machine Learning enables computers to learn from data.

---

## Key Concepts

- Training & Inference
- Features & Labels
- Models & Accuracy

---

## Applications

- Image Recognition
- Natural Language Processing
- Recommendation Systems

---

## Next Steps

- Start with scikit-learn
- Practice with datasets
- Join ML communities
```

---

## CLI Commands Reference

### create

Create a new presentation from template:

```bash
node presentations/bin/present create "Presentation Title" --theme=professional
```

Options:
- `--theme=professional` (default) - Clean, academic style
- `--theme=modern` - Vibrant, animated style

### build

Convert Markdown to HTML:

```bash
node presentations/bin/present build presentation.md
```

This creates `presentation.html`.

### serve

Serve presentation locally with live preview:

```bash
node presentations/bin/present serve presentation.md --port=8080
```

Open http://localhost:8080 in your browser.

Options:
- `--port=8080` (default) - Server port

### ai-generate

Get guidance for AI-assisted creation:

```bash
node presentations/bin/present ai-generate "Your Topic"
```

### list

List all Markdown files in current directory:

```bash
node presentations/bin/present list
```

---

## Integration with OpenCode

### Option 1: Direct Invocation

Run from anywhere using full path:

```bash
# Add to your PATH
export PATH="/path/to/opencode-presentations-skill/presentations/bin:$PATH"

# Now you can use
present create "My Talk"
```

### Option 2: Create an Alias

Add to your `.bashrc` or `.zshrc`:

```bash
# Add to ~/.zshrc
alias present='node /path/to/opencode-presentations-skill/presentations/bin/present'

# Reload shell
source ~/.zshrc

# Now use
present create "My Talk"
```

### Option 3: Use npx

```bash
# Clone first
git clone https://github.com/molhamfetnah/opencode-presentations-skill.git

# Run without adding to PATH
npx present create "My Talk"
```

---

## Advanced Usage

### PDF Export

To generate PDF, use Marp directly:

```bash
npx marp presentation.md -o presentation.pdf --pdf
```

Note: Requires Chrome/Chromium for PDF rendering.

### Custom Theme

Create your own template in `templates/`:

```markdown
---
marp: true
theme: default
style: |
  /* Your custom CSS */
  section {
    background: #your-color;
    font-size: 32px;
  }
---

# Your Title
```

### Using with Reveal.js

Marp outputs Reveal.js-compatible HTML. For full Reveal.js features:

```bash
npx marp presentation.md -o presentation.html --reveal -t reveal
```

---

## Troubleshooting

### Error: "npx: command not found"

Install Node.js from https://nodejs.org/

### Error: "marp not found"

Run `npm install` in the project directory.

### Presentation not displaying correctly

Check your Markdown syntax. Ensure:
- `---` separates slides
- No extra whitespace before directives

### Port already in use

Specify a different port:

```bash
node presentations/bin/present serve presentation.md --port=3000
```

---

## File Structure

```
opencode-presentations-skill/
├── .gitignore
├── README.md                    # This file
├── ARCHITECTURE.md              # System architecture
├── IMPLEMENTATION.md           # Code analysis
├── package.json
├── package-lock.json
└── presentations/
    ├── SKILL.md               # OpenCode skill definition
    ├── bin/
    │   └── present           # CLI entry point
    └── templates/
        ├── professional.md   # Professional theme
        └── modern.md         # Modern theme
```

---

## Credits

- Built with [Marp](https://marp.app/)
- Inspired by OpenCode's skill ecosystem

## License

MIT License - feel free to use and modify!

---

## Questions?

- Open an issue: https://github.com/molhamfetnah/opencode-presentations-skill/issues
- Check ARCHITECTURE.md for detailed system design
- Check IMPLEMENTATION.md for code analysis