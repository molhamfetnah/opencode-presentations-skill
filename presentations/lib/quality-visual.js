/**
 * Visual Companion for Quality Checker
 * 
 * Provides ASCII chart visualizations and visual representations
 * of presentation quality analysis.
 */

export function generateVisualReport(analysisResult) {
  const { overall, grades, slideCount } = analysisResult;
  const overallGrade = gradeToScore(overall);
  
  let output = '';
  
  output += header(overall);
  output += radarChart(grades);
  output += barChart(grades);
  output += slideBreakdown(slideCount, grades);
  output += footer();
  
  return output;
}

function gradeToScore(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function header(overall) {
  const grade = gradeToScore(overall);
  const gradeColor = grade === 'A' ? '✓' : grade === 'B' ? '◈' : grade === 'C' ? '◆' : grade === 'D' ? '◇' : '✗';
  
  return `
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION QUALITY VISUAL                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ${gradeColor}  OVERALL GRADE: ${grade}  (${overall}/100)                │
│                                                         │
└─────────────────────────────────────────────────────────┘

`;
}

function radarChart(grades) {
  const categories = Object.keys(grades);
  const maxLen = Math.max(...categories.map(c => c.replace(/([A-Z])/g, ' $1').length));
  
  const lines = [];
  lines.push('    RADAR CHART (scores 0-100)');
  lines.push('    ' + '─'.repeat(maxLen + 15));
  
  const scores = categories.map(c => grades[c].score);
  const maxScore = Math.max(...scores);
  const scaled = scores.map(s => Math.round((s / 100) * 10));
  
  for (let i = 10; i >= 0; i -= 2) {
    let line = '    ';
    line += `${String(i * 10).padStart(3)} `;
    
    scaled.forEach((val, idx) => {
      const normalizedVal = Math.round(val / 2);
      const half = Math.round(scaled[idx] / 2);
      
      if (val >= i) {
        line += '●';
      } else if (val >= i - 1) {
        line += '○';
      } else {
        line += ' ';
      }
      line += '  ';
    });
    
    lines.push(line);
  }
  
  lines.push('       ' + categories.map((_, i) => String.fromCharCode(65 + i)).join('  '));
  
  const labelY = 11 + categories.length + 3;
  lines.push('');
  lines.push('    Legend: A=Single Idea, B=Visual Hierarchy, C=Whitespace');
  lines.push('           D=Color Palette, E=Typography, F=Mobile-First');
  lines.push('           G=Consistency, H=Accessibility');
  
  return lines.join('\n') + '\n\n';
}

function barChart(grades) {
  let output = '    SCORE BREAKDOWN\n';
  output += '    ' + '═'.repeat(60) + '\n';
  
  const sorted = Object.entries(grades).sort((a, b) => b[1].score - a[1].score);
  
  sorted.forEach(([name, data], idx) => {
    const label = name.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
    const paddedLabel = label.padEnd(18);
    const score = data.score;
    const barLen = Math.floor(score / 5);
    const bar = '█'.repeat(barLen) + '░'.repeat(20 - barLen);
    const grade = data.grade;
    
    output += `    ${idx + 1}. ${paddedLabel} │${bar}│ ${String(score).padStart(3)} (${grade})\n`;
  });
  
  output += '    ' + '─'.repeat(60) + '\n';
  
  return output + '\n';
}

function slideBreakdown(slideCount, grades) {
  const failCount = Object.values(grades).filter(g => g.score < 70).length;
  
  let output = '    SLIDE ANALYSIS\n';
  output += '    ' + '─'.repeat(40) + '\n';
  output += `    Total Slides: ${slideCount}\n`;
  output += `    Areas Needing Attention: ${failCount}/8\n`;
  
  if (failCount > 0) {
    const failed = Object.entries(grades)
      .filter(([_, g]) => g.score < 70)
      .map(([name, _]) => name.replace(/([A-Z])/g, ' $1'));
    output += `    Failed Categories: ${failed.join(', ')}\n`;
  } else {
    output += '    Status: All categories passing ✓\n';
  }
  
  return output + '\n';
}

function footer() {
  return `
┌─────────────────────────────────────────────────────────┐
│  Tip: Run with --improve to get specific suggestions    │
│  for low-scoring categories.                           │
└─────────────────────────────────────────────────────────┘
`;
}

export async function miniScore(markdown) {
  const { analyzePresentation } = await import('./quality-checker.js');
  const result = analyzePresentation(markdown);
  
  const grade = gradeToScore(result.overall);
  const bar = '█'.repeat(Math.floor(result.overall / 10)) + '░'.repeat(10 - Math.floor(result.overall / 10));
  
  return `[${grade}] ${bar} ${result.overall}/100`;
}

export async function diffView(original, improved) {
  const { analyzePresentation } = await import('./quality-checker.js');
  const origResult = analyzePresentation(original);
  const imprResult = analyzePresentation(improved);
  
  let output = '    QUALITY IMPROVEMENT DIFF\n';
  output += '    ' + '═'.repeat(60) + '\n\n';
  
  const origOverall = origResult.overall;
  const imprOverall = imprResult.overall;
  const delta = imprOverall - origOverall;
  
  output += `    Original Score:  ${origOverall}/100 (${gradeToScore(origOverall)})\n`;
  output += `    Improved Score: ${imprOverall}/100 (${gradeToScore(imprOverall)})\n`;
  output += `    Change: ${delta >= 0 ? '+' : ''}${delta} points\n\n`;
  
  const categories = Object.keys(origResult.grades);
  output += '    Category Changes:\n';
  output += '    ' + '─'.repeat(40) + '\n';
  
  categories.forEach(cat => {
    const orig = origResult.grades[cat].score;
    const impr = imprResult.grades[cat].score;
    const change = impr - orig;
    const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '─';
    const label = cat.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
    
    output += `      ${label.padEnd(18)} ${orig} → ${impr} (${arrow}${Math.abs(change)})\n`;
  });
  
  return output;
}