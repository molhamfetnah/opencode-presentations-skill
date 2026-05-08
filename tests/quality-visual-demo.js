#!/usr/bin/env node

import { generateVisualReport } from '../presentations/lib/quality-visual.js';
import { analyzePresentation } from '../presentations/lib/quality-checker.js';

const sampleSlide = `---
marp: true
style: |
  section { background: #fff; padding: 50px; }
  h1 { color: #333; font-size: 2.5em; }
  li { color: #555; line-height: 1.8; }
---

# 10 Tips for Better Sleep

## Your Guide to Restful Nights

---

## Introduction

- Why sleep matters for health
- Common sleep problems
- What we'll cover today

---

## Tip 1: Stick to a Schedule

Go to bed and wake up at the same time every day, even on weekends.

---

## Tip 2: Create a Relaxing Routine

Develop a pre-sleep ritual: read a book or practice gentle stretches.

---

## Key Takeaways

1. Consistency is everything
2. Your environment matters
3. Limit stimulants and screens

---

## Q&A

Questions?
`;

console.log('\n============================================================');
console.log('       QUALITY VISUAL COMPANION - LIVE DEMO');
console.log('============================================================\n');

const result = analyzePresentation(sampleSlide);
const visualReport = generateVisualReport(result);

console.log(visualReport);

console.log('Raw Analysis Data:');
console.log(JSON.stringify(result, null, 2).substring(0, 500) + '...\n');