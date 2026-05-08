#!/usr/bin/env node

import { describe, it, assertEquals } from './test-framework.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const QC_PATH = join(ROOT_DIR, 'presentations', 'lib', 'quality-checker.js');

let qualityChecker;
try {
  const mod = await import(QC_PATH);
  qualityChecker = mod;
} catch (e) {
  console.error('Failed to import quality-checker.js:', e.message);
  process.exit(1);
}

const { analyzePresentation, generateReport, quickScore } = qualityChecker;

const SAMPLE_SLIDES = {
  good: `---
marp: true
theme: default
---

# Welcome

- Single idea slide
- Clean bullets

---

## Second Slide

![image](url)

- Point one
- Point two
- Point three
`,

  cluttered: `---
marp: true
theme: default
---

# Main Title

## Section One
## Section Two

- Point 1
- Point 2
- Point 3
- Point 4
- Point 5
- Point 6
- Point 7
- Point 8

Some long paragraph that goes on and on and on without any breaks whatsover which makes it very hard to read especially on mobile devices where space is limited

![image](url)

\`\`\`js
const code = "here";
\`\`\`

| Column 1 | Column 2 | Column 3 | Column 4 | Column 5 |
|----------|----------|----------|----------|----------|
| Data     | Data     | Data     | Data     | Data     |
`,

  accessibility: `---
marp: true
style: |
  background: #000;
---

# Slide

## Only H2

![image](no-alt-url)

`,

  consistent: `---
marp: true
style: |
  .green { color: #00ff00; }
  .red { color: #ff0000; }
  .blue { color: #0000ff; }
  background: linear-gradient(45deg, #000, #fff);
  background: linear-gradient(90deg, #000, #fff);
  background: linear-gradient(180deg, #000, #fff);
  background: linear-gradient(270deg, #000, #fff);
  background: linear-gradient(360deg, #000, #fff);
  background: linear-gradient(450deg, #000, #fff);
---

# Title One

- Bullet one
- Bullet two

---

# Title Two

* Asterisk bullet
* Asterisk bullet

---

# Title Three

1. Numbered one
2. Numbered two
3. Numbered three
`
};

console.log('Testing quality-checker.js...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertInRange(value, min, max, message) {
  if (value < min || value > max) {
    throw new Error(message || `Expected ${value} between ${min} and ${max}`);
  }
}

console.log('analyzePresentation()');

test('returns object with expected keys', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.good);
  assert(typeof result === 'object', 'Result should be object');
  assert(typeof result.overall === 'number', 'Should have overall score');
  assert(typeof result.grades === 'object', 'Should have grades');
  assert(typeof result.recommendations === 'object', 'Should have recommendations');
  assert(typeof result.slideCount === 'number', 'Should have slide count');
  assert(typeof result.analyzedAt === 'string', 'Should have timestamp');
});

test('overall score is 0-100', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.good);
  assertInRange(result.overall, 0, 100, 'Overall should be 0-100');
});

test('grades contain 8 categories', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.good);
  const gradeCount = Object.keys(result.grades).length;
  assert(gradeCount === 8, `Expected 8 grades, got ${gradeCount}`);
});

test('grades have score, issues, grade properties', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.good);
  Object.entries(result.grades).forEach(([name, grade]) => {
    assert(typeof grade.score === 'number', `${name}: score should be number`);
    assert(Array.isArray(grade.issues), `${name}: issues should be array`);
    assert(typeof grade.grade === 'string', `${name}: grade should be string`);
  });
});

test('cluttered slides score lower', () => {
  const goodResult = analyzePresentation(SAMPLE_SLIDES.good);
  const clutteredResult = analyzePresentation(SAMPLE_SLIDES.cluttered);
  assert(goodResult.overall > clutteredResult.overall, 
    `Good (${goodResult.overall}) should score higher than cluttered (${clutteredResult.overall})`);
});

test('slide count includes front matter', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.good);
  assert(result.slideCount >= 2, `Expected at least 2 slides, got ${result.slideCount}`);
});

console.log('\nCategory-specific checks');

test('singleIdea detects multiple headings', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.cluttered);
  const issues = result.grades.singleIdea.issues;
  const hasMultiHeading = issues.some(i => i.includes('Multiple'));
  assert(hasMultiHeading, 'Should detect multiple section headings');
});

test('singleIdea detects too many bullets', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.cluttered);
  const issues = result.grades.singleIdea.issues;
  const hasTooMany = issues.some(i => i.includes('bullet'));
  assert(hasTooMany, 'Should detect excessive bullet points');
});

test('visualHierarchy detects missing heading', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.accessibility);
  const issues = result.grades.visualHierarchy.issues;
  const hasNoHeading = issues.some(i => i.includes('No main heading'));
  assert(hasNoHeading, 'Should detect missing main heading');
});

test('accessibility detects missing alt text', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.accessibility);
  const issues = result.grades.accessibility.issues;
  const hasAltIssue = issues.some(i => i.includes('alt text'));
  assert(hasAltIssue, 'Should detect missing alt text');
});

test('consistency detects mixed bullets', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.consistent);
  const issues = result.grades.consistency.issues;
  const hasMixedBullets = issues.some(i => i.includes('Mixed bullet'));
  assert(hasMixedBullets, 'Should detect mixed bullet styles');
});

console.log('\ngenerateReport()');

test('returns string', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.good);
  const report = generateReport(result);
  assert(typeof report === 'string', 'Report should be string');
  assert(report.length > 100, 'Report should have substantial content');
});

test('contains score', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.good);
  const report = generateReport(result);
  assert(report.includes('Overall Score:'), 'Should include overall score');
});

test('contains grade', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.good);
  const report = generateReport(result);
  const grade = result.grades.singleIdea.grade;
  assert(report.includes(`(${grade})`), `Should include grade ${grade}`);
});

test('contains bar charts', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.good);
  const report = generateReport(result);
  assert(report.includes('█') || report.includes('░'), 'Should contain ASCII bar chart');
});

test('report format is complete', () => {
  const result = analyzePresentation(SAMPLE_SLIDES.cluttered);
  const report = generateReport(result);
  assert(report.includes('QUALITY REPORT') || report.includes('Overall Score:'), 
    'Report should include quality report header');
  const lines = report.split('\n').filter(l => l.trim()).length;
  assert(lines > 15, `Report should have substantial content (${lines} lines)`);
});

console.log('\nquickScore()');

test('returns number', () => {
  const score = quickScore(SAMPLE_SLIDES.good);
  assert(typeof score === 'number', 'Quick score should return number');
});

test('returns 0-100', () => {
  const score = quickScore(SAMPLE_SLIDES.good);
  assertInRange(score, 0, 100, 'Quick score should be 0-100');
});

test('higher for good than cluttered', () => {
  const goodScore = quickScore(SAMPLE_SLIDES.good);
  const clutteredScore = quickScore(SAMPLE_SLIDES.cluttered);
  assert(goodScore > clutteredScore, 
    `Good (${goodScore}) should score higher than cluttered (${clutteredScore})`);
});

console.log('\nEdge cases');

test('empty content', () => {
  const result = analyzePresentation('');
  assertInRange(result.overall, 0, 100, 'Empty should return valid score');
});

test('single slide', () => {
  const single = '# Only One Slide';
  const result = analyzePresentation(single);
  assert(result.slideCount >= 1, 'Should count at least one slide');
});

test('unicode content', () => {
  const unicode = '# 标题 🎉\n- ポイント\n- 次のポイント';
  const result = analyzePresentation(unicode);
  assertInRange(result.overall, 0, 100, 'Unicode should return valid score');
});

test('no recommendations for perfect score', () => {
  const perfect = '# Title\n\n- Clean\n- Simple\n- One idea';
  const result = analyzePresentation(perfect);
  if (result.overall >= 80) {
    assert(result.recommendations.length <= 3, 'High scores should have few recommendations');
  }
});

console.log('\n' + '─'.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('─'.repeat(50));

process.exit(failed > 0 ? 1 : 0);
