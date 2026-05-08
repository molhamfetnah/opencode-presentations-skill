#!/usr/bin/env node

import { createInterface } from 'readline';
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const TEMPLATES_DIR = join(ROOT_DIR, 'templates');
const STYLES_DIR = join(ROOT_DIR, 'styles');

const COLORS = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
};

const THEMES = [
  { id: 'professional', name: 'Professional', desc: 'clean, business' },
  { id: 'modern', name: 'Modern', desc: 'vibrant, animated' }
];

const STYLES = [
  { id: 'glassmorphism', desc: 'Frosted glass effects' },
  { id: 'neon-cyber', desc: 'Cyberpunk glow' },
  { id: 'gradient-minimal', desc: 'Clean gradient backgrounds' },
  { id: 'isometric', desc: '3D isometric layouts' },
  { id: 'brutalist', desc: 'Bold raw aesthetic' },
  { id: 'corporate-blue', desc: 'Corporate blue theme' },
  { id: 'executive-dark', desc: 'Executive dark mode' },
  { id: 'clean-white', desc: 'Minimal clean white' },
  { id: 'editorial', desc: 'Magazine editorial style' },
  { id: 'academic', desc: 'Academic presentation' },
  { id: 'geometric', desc: 'Geometric patterns' },
  { id: 'paper-cutout', desc: 'Paper craft cutouts' },
  { id: 'watercolor', desc: 'Watercolor painted' },
  { id: 'retro', desc: 'Retro vintage vibes' },
  { id: 'pop-art', desc: 'Pop art bold colors' },
  { id: 'terminal', desc: 'Terminal/hacker style' },
  { id: 'blueprint', desc: 'Blueprint technical' },
  { id: 'data-viz', desc: 'Data visualization' },
  { id: 'dev-tools', desc: 'Developer tools theme' },
  { id: 'saas-dashboard', desc: 'SaaS dashboard style' }
];

const SIZES = [
  { id: '16:9', name: '16:9', dims: '1920x1080', desc: 'Widescreen, default' },
  { id: '4:3', name: '4:3', dims: '1440x1080', desc: 'Traditional' },
  { id: '1:1', name: '1:1', dims: '1080x1080', desc: 'Square' },
  { id: '9:16', name: '9:16', dims: '1080x1920', desc: 'Vertical/Story' },
  { id: '21:9', name: '21:9', dims: '2560x1080', desc: 'Ultrawide' }
];

const OUTPUT_FORMATS = [
  { id: 'html', name: 'HTML only', letter: 'H' },
  { id: 'pdf', name: 'PDF only', letter: 'P' },
  { id: 'both', name: 'HTML and PDF', letter: 'B' }
];

const PREVIEW_OPTS = [
  { id: 'live', name: 'Live (hot reload)', letter: 'L' },
  { id: 'once', name: 'One time', letter: 'O' },
  { id: 'none', name: 'No preview', letter: 'N' }
];

function displayHeader() {
  console.log('');
  console.log(`${COLORS.cyan}╔════════════════════════════════════════╗`);
  console.log(`║       🎨 Presentations Wizard         ║`);
  console.log(`╚════════════════════════════════════════╝${COLORS.reset}`);
  console.log('');
}

function displayStyles() {
  console.log(`${COLORS.cyan}Select style (1-20):${COLORS.reset}`);
  console.log('');
  console.log('MODERN:');
  STYLES.slice(0, 5).forEach((s, i) => {
    console.log(`  ${COLORS.magenta}${String(i + 1).padStart(2, '0')}. ${s.id}${COLORS.reset}  - ${s.desc}`);
  });
  console.log('');
  console.log('PROFESSIONAL:');
  STYLES.slice(5, 10).forEach((s, i) => {
    console.log(`  ${COLORS.magenta}${String(i + 6).padStart(2, '0')}. ${s.id}${COLORS.reset}  - ${s.desc}`);
  });
  console.log('');
  console.log('CREATIVE:');
  STYLES.slice(10, 15).forEach((s, i) => {
    console.log(`  ${COLORS.magenta}${String(i + 11).padStart(2, '0')}. ${s.id}${COLORS.reset}  - ${s.desc}`);
  });
  console.log('');
  console.log('TECH:');
  STYLES.slice(15, 20).forEach((s, i) => {
    console.log(`  ${COLORS.magenta}${String(i + 16).padStart(2, '0')}. ${s.id}${COLORS.reset}  - ${s.desc}`);
  });
  console.log('');
}

function displaySizes() {
  console.log(`${COLORS.cyan}Select size:${COLORS.reset}`);
  SIZES.forEach((s, i) => {
    const defaultMark = s.id === '16:9' ? ' (default)' : '';
    console.log(`  ${COLORS.magenta}${s.name}${COLORS.reset} - ${s.dims}${defaultMark} (${s.desc})`);
  });
  console.log('');
}

function promptText(rl, prompt, defaultVal = '') {
  return new Promise((resolve) => {
    const promptStr = defaultVal
      ? `${COLORS.yellow}${prompt}${COLORS.reset} [${defaultVal}]: `
      : `${COLORS.yellow}${prompt}${COLORS.reset}: `;
    
    rl.question(promptStr, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

function promptSelect(rl, prompt, options, defaultIdx = 0) {
  return new Promise((resolve) => {
    console.log(`${COLORS.cyan}${prompt}${COLORS.reset}`);
    options.forEach((opt, i) => {
      const marker = opt.letter ? `[${opt.letter}]` : `${i + 1}.`;
      const defaultMark = i === defaultIdx ? ' (default)' : '';
      const name = opt.name || opt.id;
      console.log(`  ${COLORS.magenta}${marker}${COLORS.reset} ${name}${defaultMark}`);
    });
    console.log('');
    
    const letters = options.filter(o => o.letter).map(o => o.letter.toLowerCase());
    const letterPrompt = letters.length > 0 ? ` (or ${letters.join('/')})` : '';
    
    rl.question(`${COLORS.yellow}Enter choice${letterPrompt}${COLORS.reset}: `, (answer) => {
      const input = answer.trim().toLowerCase();
      
      if (!input) {
        resolve(options[defaultIdx].id);
        return;
      }
      
      if (letters.includes(input)) {
        const found = options.find(o => o.letter.toLowerCase() === input);
        if (found) {
          resolve(found.id);
          return;
        }
      }
      
      const num = parseInt(input, 10);
      if (!isNaN(num) && num >= 1 && num <= options.length) {
        resolve(options[num - 1].id);
        return;
      }
      
      const exactMatch = options.find(o => o.id.toLowerCase() === input);
      if (exactMatch) {
        resolve(exactMatch.id);
        return;
      }
      
      resolve(options[defaultIdx].id);
    });
  });
}

function createPresentation(title, theme, style, size, outputFormat, preview) {
  const templateFile = join(TEMPLATES_DIR, `${theme}.md`);
  
  if (!existsSync(templateFile)) {
    throw new Error(`Template not found: ${templateFile}`);
  }
  
  const { readFileSync } = require('fs');
  let content = readFileSync(templateFile, 'utf-8');
  content = content.replace('{title}', title);
  content = content.replace('size: 16:9', `size: ${size}`);
  
  if (style) {
    const styleFile = join(STYLES_DIR, `${style}.css`);
    if (existsSync(styleFile)) {
      const styleCSS = readFileSync(styleFile, 'utf-8');
      content = content.replace('---', `---\nstyle: |\n${styleCSS}\n---`);
    }
  }
  
  const filename = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md';
  writeFileSync(filename, content);
  
  return { filename, style, size, outputFormat, preview };
}

export async function launchWizard(rl = null) {
  let shouldCloseRl = false;
  if (!rl) {
    rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    shouldCloseRl = true;
  }
  
  try {
    displayHeader();
    
    const title = await promptText(rl, 'Please enter presentation title');
    if (!title) {
      console.log(`${COLORS.yellow}Title is required. Exiting.${COLORS.reset}`);
      return null;
    }
    
    const theme = await promptSelect(rl, 'Select theme:', THEMES, 0);
    
    displayStyles();
    const styleNum = await promptText(rl, 'Style number (1-20)', '1');
    const styleIdx = parseInt(styleNum, 10) - 1;
    const style = (styleIdx >= 0 && styleIdx < STYLES.length) ? STYLES[styleIdx].id : 'glassmorphism';
    
    displaySizes();
    const size = await promptSelect(rl, 'Select size:', SIZES, 0);
    
    const outputFormat = await promptSelect(rl, 'Select output format:', OUTPUT_FORMATS, 2);
    
    const preview = await promptSelect(rl, 'Select preview:', PREVIEW_OPTS, 0);
    
    console.log('');
    console.log(`${COLORS.cyan}Creating presentation...${COLORS.reset}`);
    
    const result = createPresentation(title, theme, style, size, outputFormat, preview);
    
    console.log(`${COLORS.green}Created: ${result.filename}${COLORS.reset}`);
    console.log(`  Theme: ${theme}`);
    console.log(`  Style: ${style}`);
    console.log(`  Size: ${size}`);
    console.log(`  Format: ${outputFormat}`);
    console.log(`  Preview: ${preview}`);
    
    return result;
    
  } catch (error) {
    console.error(`${COLORS.yellow}Error: ${error.message}${COLORS.reset}`);
    return null;
  } finally {
    if (shouldCloseRl) {
      rl.close();
    }
  }
}

export async function runWizard() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return launchWizard(rl);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runWizard();
}