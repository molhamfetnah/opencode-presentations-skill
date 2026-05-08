# Implementation Plan: Interactive Wizard System

## Context

The presentations plugin currently uses command-line arguments for all options. We need to add an interactive wizard that automatically prompts users with dialogs for each multi-option choice in the pipeline.

## Goals

1. **Automatic Wizard Flow** - When called without arguments, launch interactive dialogs
2. **Multi-Option Dialogs** - Every multi-option choice gets a selection dialog
3. **Human-Like Testing** - Launch subagent to act as human user
4. **Quality Evaluation** - Evaluate output using UX/UI best practices
5. **Stress Testing** - Test the wizard under load

## Tasks

### Task 1: Create Interactive Wizard CLI
- Add `present wizard` command
- Auto-launch when called without required args
- Use `readline` for interactive prompts
- Dialog for: theme, style, size, output format, preview

### Task 2: Add Selection Dialogs
- Style selector (20 styles with preview)
- Size selector (5 sizes with descriptions)
- Output format (HTML, PDF, Both)
- Preview options (live, once, none)

### Task 3: Create UX/UI Quality Assessment Module
- Implement best practices checker
- Single idea per slide validation
- Typography hierarchy checker
- Whitespace/consistency checker
- Mobile-first validation

### Task 4: Stress Test the Wizard
- Rapid dialog interactions
- Edge cases (interrupt, invalid input)
- Concurrent wizard sessions

### Task 5: Launch Human-Like Subagent
- Act as user designing carousel
- Make natural choices
- Evaluate output quality
- Report findings

## Design Decisions

### Wizard Flow
```
present create → Wizard (auto if no args)
  └─ Title: [prompt]
  └─ Theme: [professional|modern] (default: professional)
  └─ Style: [20 options with descriptions] (default: glassmorphism)
  └─ Size: [5 options with dimensions] (default: 16:9)
  └─ Output: [html|pdf|both] (default: html)
  └─ Preview: [live|once|none] (default: once)
  └─ [Create presentation]
```

### UX/UI Quality Criteria
- Single clear idea per slide
- Strong visual hierarchy
- Generous whitespace
- Limited color palette
- Brand consistency
- Mobile-first design

## Dependencies

- `readline` (built-in Node.js) for prompts
- No external UI libraries (keep it CLI)
- ANSI colors for highlighting

## Files to Create/Modify

1. `presentations/bin/wizard.js` - Main wizard logic
2. `presentations/lib/quality-checker.js` - UX/UI assessment
3. `presentations/bin/present` - Add wizard command
4. `tests/wizard-stress-test.js` - Wizard stress tests
5. `tests/human-like-test.js` - Subagent human simulation