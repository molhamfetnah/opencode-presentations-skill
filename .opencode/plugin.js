/**
 * Presentations Plugin for OpenCode.ai v2.0.0
 * 
 * Enhanced presentation generator with:
 * - 20 design styles (Modern, Professional, Creative, Tech)
 * - 5 slide sizes (16:9, 4:3, 1:1, 9:16, 21:9)
 * - Carousel component designs
 * - Live preview with hot reload
 * - Chart support via ApexCharts
 * - AI image generation (Nano Banana + Pollinations free)
 * - Web scraping for design inspiration
 */

export function registerSkills(skills) {
  skills.register('presentations', {
    description: 'Generate professional presentations with 20 styles, carousels, charts, AI images, and live preview',
    commands: [
      'create <title> [--theme=professional|modern] [--style=<name>] [--size=<size>]',
      'build <file.md>',
      'serve <file.md> [--port=8080]',
      'preview <file.md> [--port=3000]',
      'styles',
      'sizes',
      'chart <type> [data]',
      'carousel --type=<type>',
      'scrape-styles <source> [--count=10]',
      'ai-image "prompt" [--output=image.png]',
      'export <file.md> --format=html|pdf',
      'ai-generate <topic>',
      'list'
    ],
    features: [
      '20 Design Styles',
      '5 Slide Sizes',
      'Carousel Designs (5 types)',
      'Live Preview with Hot Reload',
      'Chart Support (ApexCharts)',
      'AI Image Generation',
      'Web Scraping for Styles'
    ]
  });
}

export function bootstrap() {
  return {
    name: 'presentations',
    version: '2.0.0'
  };
}