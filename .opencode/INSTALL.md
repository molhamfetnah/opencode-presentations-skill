# Installing Presentations for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add presentations to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["presentations@git+https://github.com/molhamfetnah/opencode-presentations-skill.git"]
}
```

Restart OpenCode. The plugin installs through OpenCode's plugin manager and registers the skill.

## Usage

Use OpenCode's native `skill` tool:

```
use skill tool to load presentations
```

Or use the CLI directly:

```bash
node presentations/bin/present create "My Talk"
```

## Adding as Alias

Add to your ~/.zshrc for convenience:

```bash
alias presentations="node ~/path/to/opencode-presentations-skill/presentations/bin/present"
```

Then use:
```bash
presentations create "My Talk"
```

## Updating

The skill updates through OpenCode's git-backed package. Restart and run:

```
presentations update
```

## Troubleshooting

### Skill not loading

1. Check that the plugin is in your `opencode.json`
2. Restart OpenCode
3. Verify the repository URL is correct

### Build errors

Ensure Node.js 18+ is installed and dependencies are installed:
```bash
cd opencode-presentations-skill
npm install
```

### Tool Mapping

When skills reference Claude Code tools:
- `TodoWrite` → `todowrite`
- `Skill` tool → OpenCode's native `skill` tool
- File operations → your native tools