# OpenCode Presentations Skill - Implementation Deep Analysis

> **Version:** 1.0.0  
> **Date:** 2026-05-07  
> **Repository:** https://github.com/molhamfetnah/opencode-presentations-skill

---

## Table of Contents

1. [Introduction](#introduction)
2. [Implementation Details](#implementation-details)
3. [Code Analysis](#code-analysis)
4. [Testing Strategy](#testing-strategy)
5. [Design Decisions](#design-decisions)
6. [Limitations & Known Issues](#limitations--known-issues)
7. [Extensibility Guide](#extensibility-guide)
8. [Lessons Learned](#lessons-learned)

---

## 1. Introduction

This document provides an in-depth technical analysis of the OpenCode Presentations Skill implementation. It goes beyond the high-level architecture to examine the actual code, design rationale, and implementation choices.

### 1.1 Scope

- CLI implementation (`present` command)
- Template system (professional and modern themes)
- Integration with Marp ecosystem for HTML generation

---

## 2. Implementation Details

### 2.1 Project Structure

```
/mnt/data/projects/opencode-presentations-skill/
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
├── ARCHITECTURE.md
└── presentations/
    ├── SKILL.md
    ├── bin/
    │   └── present     # Main CLI script
    └── templates/
        ├── professional.md
        └── modern.md
```

### 2.2 Package Configuration

**package.json:**

```json
{
  "name": "@opencode/presentations",
  "version": "1.0.0",
  "description": "Marp-based presentation generator for OpenCode",
  "type": "module",
  "bin": {
    "present": "./presentations/bin/present"
  },
  "dependencies": {
    "@marp-team/marp-cli": "^4.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Key Decisions:**
- `type: "module"` enables ES modules (ESM)
- `bin` entry enables CLI invocation
- Single dependency: `@marp-team/marp-cli`

---

## 3. Code Analysis

### 3.1 CLI Entry Point

**File:** `presentations/bin/present`

#### Imports

```javascript
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
```

| Import | Purpose |
|--------|---------|
| `execSync` | Execute Marp CLI commands |
| `dirname, join` | Path manipulation |
| `fileURLToPath` | ESM __dirname equivalent |
| `readFileSync, readdirSync, writeFileSync` | File I/O |

#### Path Resolution

```javascript
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatesDir = join(__dirname, '..', 'templates');
```

**Pattern:** ESM doesn't have `__dirname`, so we derive it from `import.meta.url`.

**templatesDir:** Points to `presentations/templates/`

#### Command Handler Pattern

```javascript
const commands = {
  create: (args) => { /* ... */ },
  build: (args) => { /* ... */ },
  serve: (args) => { /* ... */ },
  'ai-generate': (args) => { /* ... */ },
  list: () => { /* ... */ }
};
```

Each command is a function that takes parsed arguments.

#### Arguments Parsing

```javascript
const command = process.argv[2];
const args = process.argv.slice(3);
```

| Variable | Value |
|----------|-------|
| `command` | First argument after `present` |
| `args` | All remaining arguments |

**Example:**
```
present create "My Talk" --theme=professional
         │───────│         │──────────────────│
      command     args[0]      args[1]
```

### 3.2 Command Implementations

#### Create Command

```javascript
create: (args) => {
  const title = args[0];
  const theme = args.includes('--theme=modern') ? 'modern' : 'professional';
  const templateFile = join(templatesDir, `${theme}.md`);
  const template = readFileSync(templateFile, 'utf-8');
  const content = template.replace('{title}', title);
  const filename = title.toLowerCase().replace(/\s+/g, '-') + '.md';
  writeFileSync(filename, content);
  console.log(`Created: ${filename}`);
}
```

**Flow:**
1. Get title from args[0]
2. Determine theme (default: professional)
3. Load template file
4. Replace `{title}` placeholder
5. Generate filename (slugified)
6. Write to current directory

**Slugification:**
```javascript
title.toLowerCase().replace(/\s+/g, '-')
// "My Talk" → "my-talk"
```

#### Build Command

```javascript
build: (args) => {
  const input = args[0];
  const output = input.replace('.md', '.html');
  execSync(`npx marp ${input} -o ${output}`, { stdio: 'inherit' });
  console.log(`Built: ${output}`);
}
```

**Marp CLI Options:**
| Option | Description |
|--------|-------------|
| `-o` | Output file |
| `--pdf` | PDF output |
| `-s` | Server mode |
| `--port` | Server port |

#### Serve Command

```javascript
serve: (args) => {
  const input = args[0];
  const port = args.includes('--port=') 
    ? args.find(a => a.startsWith('--port=')).split('=')[1] 
    : '8080';
  console.log(`Serving at http://localhost:${port}`);
  execSync(`npx marp ${input} -s --port ${port}`, { stdio: 'inherit' });
}
```

**Port Parsing:**
```javascript
args.includes('--port=') 
  ? args.find(a => a.startsWith('--port=')).split('=')[1] 
  : '8080'
// "--port=3000" → "3000"
```

#### List Command

```javascript
list: () => {
  const files = readdirSync('.').filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('No .md files found in current directory');
  } else {
    files.forEach(f => console.log(f));
  }
}
```

**Limitation:** Lists ALL .md files in current directory, including non-presentation files.

#### AI Generate Command

```javascript
'ai-generate': (args) => {
  const topic = args.join(' ');
  console.log(`AI Generation Guidance for: ${topic}`);
  console.log('');
  console.log('1. Define the presentation goal and audience');
  console.log('2. Break the topic into key sections');
  console.log('3. Create bullet points for each slide');
  console.log('4. Use --theme=professional or --theme=modern when creating');
  console.log('5. Refine content with your AI assistant');
}
```

**Note:** This is guidance only, not actual AI generation. Future versions could integrate with OpenCode's AI.

### 3.3 Template System

#### Professional Template

**File:** `templates/professional.md`

```markdown
---
marp: true
theme: default
class: lead
paginate: true
---

# {title}

## Subtitle

---

## Agenda

1. Introduction
2. Main Content
3. Conclusion

---

## Introduction

- Background context
- Key motivations
- Scope of presentation

---

## Main Content

### Section 1

Content and explanation...

### Section 2

Content and explanation...

---

## Conclusion

- Key takeaways
- Next steps
- Q&A
```

#### Modern Template

**File:** `templates/modern.md`

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

# {title}

## Engaging Subtitle

---

## Agenda

1. Introduction
2. Key Concepts
3. Deep Dive
4. Summary

---

## Introduction

- Why this matters
- What you'll learn
- Real-world applications

---

## Key Concepts

### Concept 1

Brief explanation...

### Concept 2

Brief explanation...

---

## Deep Dive

Technical details and examples...

---

## Summary

- Recap of key points
- Further resources
- Questions?
```

**Key Differences:**

| Aspect | Professional | Modern |
|--------|--------------|--------|
| Background | White | Gradient (#667eea → #764ba2) |
| Text on lead | Theme default | White with text-shadow |
| Body background | Theme default | #f8f9fa |
| Headings | Theme default | #2c3e50 |
| List items | Theme default | #34495e |

---

## 4. Testing Strategy

### 4.1 Test Commands

```bash
# Create test
node presentations/bin/present create "Test" --theme=professional

# Verify file
ls -la test.md

# Build test
node presentations/bin/present build test.md

# Verify HTML
ls -la test.html

# List test
node presentations/bin/present list

# Serve test (manual verification)
# localhost:8080

# Clean up
rm test.md test.html
```

### 4.2 Manual Verification Checklist

- [ ] Create command generates valid Markdown
- [ ] Build command generates valid HTML
- [ ] Serve command starts HTTP server
- [ ] List command shows .md files
- [ ] Theme option works correctly
- [ ] Error handling provides useful messages

---

## 5. Design Decisions

### 5.1 ES Modules

**Decision:** Use ES modules (`type: "module"`)

**Rationale:**
- Modern JavaScript standard
- Better compatibility with Node.js 18+
- Enables `import.meta.url` for path resolution

**Trade-off:** No commonJS compatibility without build step

### 5.2 Single Dependency

**Decision:** Only `@marp-team/marp-cli` as dependency

**Rationale:**
- Marp handles all conversion complexity
- Reduces maintenance burden
- Leverages well-tested library

**Trade-off:** Indirect dependencies increase attack surface

### 5.3 Command Pattern

**Decision:** Simple function-based command handler

```javascript
const commands = {
  create: (args) => { /* ... */ }
};
```

**Rationale:**
- Simple to understand
- Easy to extend
- No external CLI framework needed

**Trade-off:** Limited features (no subcommands, flags parsing)

### 5.4 Slugification

**Decision:** Simple lower-case + hyphen replacement

```javascript
title.toLowerCase().replace(/\s+/g, '-')
```

**Rationale:**
- Works for most titles
- Predictable output

**Trade-off:**
- Unicode characters not handled
- Special characters not sanitized

---

## 6. Limitations & Known Issues

### 6.1 Current Limitations

| Issue | Impact | Mitigation |
|-------|--------|------------|
| No PDF export | Can't generate PDF | Use Marp's `--pdf` flag manually |
| No custom themes | Limited styling | Edit templates directly |
| No live reload | Edit requires rebuild | Use serve + manual refresh |
| AI not integrated | No auto-generation | Use ai-generate guidance |

### 6.2 Known Issues

1. **Unicode in titles:** Characters beyond ASCII may cause issues
2. **Filename conflicts:** Overwrites existing files without warning
3. **List command noise:** Shows all .md files, not just presentations
4. **No error codes:** Error messages are informal

---

## 7. Extensibility Guide

### 7.1 Adding New Commands

Add to `commands` object:

```javascript
const commands = {
  // existing commands
  newcommand: (args) => {
    // implementation
  }
};
```

### 7.2 Adding New Themes

1. Create new template in `templates/`
2. Update code to recognize new theme name

```javascript
const theme = args.includes('--theme=newtheme') 
  ? 'newtheme' 
  : 'professional';
```

### 7.3 Custom Marp Directives

Add to template frontmatter:

```yaml
---
marp: true
theme: default
-size: 16:9
paginate: true
style: |
  /* Custom CSS */
---
```

---

## 8. Lessons Learned

### 8.1 Development Insights

1. **Path resolution in ESM:** Creating `__dirname` equivalent requires `import.meta.url`
2. **Template as code:** Using simple string replacement is sufficient for MVP
3. **execSync blocking:** Commands block execution - acceptable for CLI

### 8.2 Future Considerations

1. **Async commands:** Use `exec()` instead of `execSync()` for non-blocking
2. **Config file:** Add `.presentrc` for user preferences
3. **Plugin system:** Allow external theme plugins

### 8.3 Recommendations

1. **Start simple:** MVP approach allows fast iteration
2. **Test manually:** CLI tools require human verification
3. **Document decisions:** Future maintainers will thank you

---

## Appendix A: Command Reference

| Command | Invocation | Output |
|---------|------------|--------|
| create | `present create "Title"` | Markdown file |
| build | `present build file.md` | HTML file |
| serve | `present serve file.md` | HTTP server |
| ai-generate | `present ai "topic"` | Guidance text |
| list | `present list` | File list |

---

## Appendix B: Error Handling

All errors caught and displayed:

```javascript
try {
  commands[command](args);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
```

---

## Appendix C: File Locations

| Purpose | Path |
|---------|------|
| CLI | `presentations/bin/present` |
| Templates | `presentations/templates/*.md` |
| Skill def | `presentations/SKILL.md` |
| Package | `package.json` |

---

*End of Implementation Deep Analysis*