# OpenCode Presentations Skill - Architecture Document

> **Version:** 1.0.0  
> **Last Updated:** 2026-05-07  
> **Repository:** https://github.com/molhamfetnah/opencode-presentations-skill

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Component Design](#component-design)
4. [Data Flow](#data-flow)
5. [Technology Stack](#technology-stack)
6. [API Reference](#api-reference)
7. [Configuration](#configuration)
8. [Security Considerations](#security-considerations)
9. [Performance](#performance)
10. [Future Improvements](#future-improvements)

---

## 1. Overview

### 1.1 Purpose

The **OpenCode Presentations Skill** is a CLI tool that generates professional presentations from Markdown using the [Marp](https://marp.app/) ecosystem. It integrates with OpenCode to provide slide creation, building, and serving capabilities.

### 1.2 Goals

- Generate dual-format presentations (HTML + PDF-ready) from single Markdown source
- Support two design themes: Professional (minimal academic) and Modern (animated)
- Accept content via Markdown files OR AI-generated content
- Seamless OpenCode CLI integration

### 1.3 Non-Goals

- GUI interface (CLI only)
- Real-time collaboration
- Cloud hosting/integration

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     OpenCode CLI                                 │
│                  (present command)                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                          │
        ▼                          ▼
┌───────────────┐          ┌──────────────────┐
│ Input Layer  │          │  Output Layer   │
│ (Markdown) │          │  (HTML/PDF)    │
└───────────────┘          └──────────────────┘
        │                          │
        ▼                          ▼
┌───────────────────────────────────────┐
│         Marp Core Engine              │
│    (@marp-team/marp-cli)            │
└───────────────────────────────────────┘
```

### 2.2 Layer Description

| Layer | Responsibility | Key Components |
|-------|--------------|---------------|
| **Input Layer** | Parse user commands, read source files | CLI parser, template loader |
| **Marp Engine** | Convert Markdown to HTML | `@marp-team/marp-cli` |
| **Output Layer** | Save/serve generated files | File writer, HTTP server |

---

## 3. Component Design

### 3.1 CLI Entry Point (`present`)

**Location:** `presentations/bin/present`

**Responsibilities:**
- Parse command-line arguments
- Route to appropriate command handler
- Error handling and user feedback

**Key Functions:**

```javascript
const commands = {
  create: (args) => { /* ... */ },
  build: (args) => { /* ... */ },
  serve: (args) => { /* ... */ },
  'ai-generate': (args) => { /* ... */ },
  list: () => { /* ... */ }
};
```

### 3.2 Template System

**Location:** `presentations/templates/`

| Template | Use Case | Styling |
|----------|---------|--------|
| `professional.md` | Academic, business presentations | Minimal, clean typography |
| `modern.md` | Engaging talks, workshops | Gradient backgrounds, animations |

**Template Structure:**

```yaml
---
marp: true
theme: default
class: lead
paginate: true
---
```

### 3.3 Skill Definition

**Location:** `presentations/SKILL.md`

OpenCode skill configuration defining:
- Invocation syntax
- Available commands
- Usage examples

---

## 4. Data Flow

### 4.1 Create Command Flow

```
User: present create "Title" --theme=professional
    │
    ▼
CLI parses arguments
    │
    ▼
Load template (professional.md)
    │
    ▼
Replace {title} placeholder
    │
    ▼
Generate filename (title.md)
    │
    ▼
Write to filesystem
    │
    ✓ Created: title.md
```

### 4.2 Build Command Flow

```
User: present build title.md
    │
    ▼
CLI validates input file
    │
    ▼
Execute: npx marp title.md -o title.html
    │
    ▼
Marp engine parses Marp directives
    │
    ▼
Convert to Reveal.js HTML
    │
    ▼
Write title.html
    │
    ✓ Built: title.html
```

### 4.3 Serve Command Flow

```
User: present serve title.md
    │
    ▼
CLI starts HTTP server
    │
    ▼
Execute: npx marp title.md -s --port 8080
    │
    ▼
Marp serves on localhost:8080
    │
    ▼
User opens browser
    │
    ✓ http://localhost:8080
```

---

## 5. Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | >= 18.0.0 |
| **Core Engine** | @marp-team/marp-cli | ^4.0.0 |
| **Output Format** | Reveal.js (via Marp) | Latest |
| **PDF Export** | Puppeteer (via Marp) | Latest |

### 5.1 Dependencies

```json
{
  "dependencies": {
    "@marp-team/marp-cli": "^4.0.0"
  }
}
```

---

## 6. API Reference

### 6.1 Command: `create`

```bash
present create <title> [--theme=professional|modern]
```

**Arguments:**
- `title` (required): Presentation title
- `--theme` (optional): Theme selection, default: `professional`

**Output:** Creates `title.md` in current directory

### 6.2 Command: `build`

```bash
present build <file.md>
```

**Arguments:**
- `file.md` (required): Input Markdown file

**Output:** Creates `file.html` in same directory

### 6.3 Command: `serve`

```bash
present serve <file.md> [--port=<number>]
```

**Arguments:**
- `file.md` (required): Input Markdown file
- `--port` (optional): Server port, default: `8080`

**Output:** HTTP server at `http://localhost:<port>`

### 6.4 Command: `ai-generate`

```bash
present ai-generate <topic>
```

**Arguments:**
- `topic` (required): Presentation topic

**Output:** Prints guidance for AI-assisted creation

### 6.5 Command: `list`

```bash
present list
```

**Output:** Lists all `.md` files in current directory

---

## 7. Configuration

### 7.1 Marp Directives

Each presentation begins with YAML frontmatter:

```yaml
---
marp: true
theme: default
class: lead
paginate: true
---
```

| Directive | Description | Values |
|----------|------------|--------|
| `marp` | Enable Marp processing | `true` |
| `theme` | Built-in theme | `default`, `gaia`, `uncover` |
| `class` | Section class | `lead`, `invert` |
| `paginate` | Enable slide numbers | `true`, `false` |

### 7.2 Custom CSS (Modern Theme)

```css
section.lead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

---

## 8. Security Considerations

### 8.1 Input Validation

- File existence checks before processing
- Error handling for missing files
- Sanitized output filenames

### 8.2 Command Execution

- Uses `execSync` for Marp commands
- No shell injection risk (arguments are not passed to shell)
- Runs in user context only

### 8.3 File System

- Creates files in current working directory only
- No path traversal vulnerabilities

---

## 9. Performance

### 9.1 Build Performance

- Typical conversion: < 1 second per slide
- Large presentations (50+ slides): ~5-10 seconds

### 9.2 Server Performance

- Serves static files only
- Suitable for local development
- Not recommended for production

---

## 10. Future Improvements

### 10.1 Planned Features

- [ ] PDF export with `--pdf` flag
- [ ] Custom theme support
- [ ] Live reload during editing
- [ ] AI content generation integration
- [ ] Reveal.js-specific directives

### 10.2 Potential Integrations

- OpenCode skill auto-discovery
- Template marketplace
- Export to LaTeX/Beamer

---

## Appendix A: File Structure

```
opencode-presentations-skill/
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── presentations/
    ├── SKILL.md
    ├── bin/
    │   └── present          # CLI entry point
    └── templates/
        ├── professional.md  # Professional theme
        └── modern.md       # Modern theme
```

---

## Appendix B: Error Codes

| Code | Description | Resolution |
|------|------------|------------|
| E001 | Missing title | Provide title argument |
| E002 | File not found | Check file path |
| E003 | Invalid theme | Use professional or modern |
| E004 | Build failed | Check Marp installation |

---

*End of Architecture Document*