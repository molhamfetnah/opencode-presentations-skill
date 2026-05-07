# Skill: presentations

Generate professional presentations (HTML + PDF) from Markdown using Marp.

## Invocation

/present <command> [args]

## Commands

### /present create <title> [--theme=professional|modern]
Create new presentation markdown file with template.

### /present build <file.md>
Build HTML + PDF from markdown file.

### /present serve <file.md>
Serve HTML presentation locally with live reload.

### /present ai-generate <topic>
Generate presentation from topic using AI.

### /present list
List all presentations in current directory.

## Examples

/present create "My Talk" --theme=professional
/present build talk.md
/present serve talk.md
/present ai-generate "Introduction to Machine Learning"