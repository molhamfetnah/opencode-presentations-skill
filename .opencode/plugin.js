/**
 * Presentations plugin for OpenCode.ai
 *
 * Exposes the presentations skill for creating HTML slides from Markdown.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function registerSkills(skills) {
  skills.register('presentations', {
    description: 'Generate professional presentations (HTML slides) from Markdown using Marp',
    commands: [
      'create <title> [--theme=professional|modern] - Create new presentation',
      'build <file.md> - Convert to HTML',
      'serve <file.md> - Serve locally', 
      'ai-generate <topic> - AI guidance',
      'list - List presentations'
    ]
  });
}

export function bootstrap(/* context */) {
  return null;
}