# Installing Presentations for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Node.js 18+ installed

## Installation

Add presentations to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["presentations@git+https://github.com/molhamfetnah/opencode-presentations-skill.git"]
}
```

Restart OpenCode. The plugin installs through OpenCode's plugin manager and registers the skill.

## Manual Installation

```bash
# Clone the repository
git clone https://github.com/molhamfetnah/opencode-presentations-skill.git

# Navigate to project
cd opencode-presentations-skill

# Install dependencies
npm install

# Verify installation
node presentations/bin/present --help
```

## Usage

Use OpenCode's native `skill` tool:

```
skill presentations
```

Or use the CLI directly:

```bash
node presentations/bin/present create "My Talk"
node presentations/bin/present styles
node presentations/bin/present sizes
```

## Adding as Alias

Add to your shell profile (~/.zshrc, ~/.bashrc):

```bash
alias present="node /path/to/opencode-presentations-skill/presentations/bin/present"
```

Then use:

```bash
present create "My Talk"
```

## Optional Dependencies

For web scraping design inspiration:

```bash
npm install puppeteer
```

## Environment Variables

For AI image generation with Nano Banana API:

```bash
export NANO_BANANA_API_KEY=your_api_key
```

Without an API key, the tool uses Pollinations.ai (free, no key required).

## Updating

```bash
cd opencode-presentations-skill
git pull origin master
npm install
```

## Troubleshooting

### Skill not loading

1. Verify the plugin is in your `opencode.json`
2. Restart OpenCode
3. Check the repository URL is correct

### Build errors

Ensure Node.js 18+ is installed:

```bash
node --version
```

Install dependencies:

```bash
npm install
```

### Web scraping not working

Install puppeteer:

```bash
npm install puppeteer
```

Note: Puppeteer requires Chrome/Chromium.

## Tool Mapping

When skills reference Claude Code tools:

- `TodoWrite` → `todowrite`
- `Skill` tool → OpenCode's native `skill` tool
- File operations → your native tools

## Support

- Report issues: https://github.com/molhamfetnah/opencode-presentations-skill/issues
- Documentation: https://github.com/molhamfetnah/opencode-presentations-skill#readme