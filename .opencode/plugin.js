/**
 * Presentations plugin for OpenCode.ai v2.0
 *
 * Enhanced with:
 * - 20 design styles
 * - Multiple slide sizes
 * - Carousel designs
 * - Live preview
 * - Chart support
 * - AI image generation
 * - Web scraping for styles
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function registerSkills(skills) {
  skills.register('presentations', {
    description: 'Generate professional presentations with 20 styles, carousels, charts, AI images, and live preview',
    commands: [
      'create <title> [--theme=<theme>] [--style=<name>] [--size=<size>] - Create presentation',
      'build <file.md> - Build HTML',
      'serve <file.md> [--port=8080] - Serve locally',
      'preview <file.md> [--port=3000] - Live preview with hot reload',
      'styles - List 20 design styles',
      'sizes - List slide sizes',
      'chart <type> [data] - Generate chart template',
      'carousel --type=<type> - Generate carousel',
      'scrape-styles <source> - Scrape design styles',
      'ai-image "prompt" - Generate AI image',
      'export <file.md> --format=html|pdf - Export presentation',
      'ai-generate <topic> - AI guidance',
      'list - List presentations'
    ],
    features: [
      '20 Design Styles (Modern, Professional, Creative, Tech)',
      '5 Slide Sizes (16:9, 4:3, 1:1, 9:16, 21:9)',
      'Carousel Designs (Coverflow, Cardstack, Parallax, Timeline)',
      'Live Preview with Hot Reload',
      'Chart Support (ApexCharts)',
      'AI Image Generation (Nano Banana API + Free alternatives)',
      'Web Scraping for Design Inspiration',
      'Direct HTML/CSS/JS Support'
    ]
  });
}

export function bootstrap(/* context */) {
  return null;
}