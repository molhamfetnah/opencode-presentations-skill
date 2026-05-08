/**
 * UX/UI Quality Checker for Presentations
 * 
 * Evaluates presentation quality based on best practices:
 * - Single idea per slide
 * - Visual hierarchy
 * - Whitespace and spacing
 * - Color palette consistency
 * - Typography readability
 * - Mobile-first design
 * - Brand consistency
 * - Accessibility
 */

export function analyzePresentation(markdownContent) {
  const slides = parseSlides(markdownContent);
  const scores = {};
  const issues = [];
  const recommendations = [];
  
  // 1. Single Idea Per Slide
  scores.singleIdea = checkSingleIdeaPerSlide(slides);
  
  // 2. Visual Hierarchy
  scores.visualHierarchy = checkVisualHierarchy(slides);
  
  // 3. Whitespace
  scores.whitespace = checkWhitespace(markdownContent, slides);
  
  // 4. Color Palette
  scores.colorPalette = checkColorPalette(markdownContent);
  
  // 5. Typography
  scores.typography = checkTypography(slides);
  
  // 6. Mobile-First
  scores.mobileFirst = checkMobileFirst(slides);
  
  // 7. Consistency
  scores.consistency = checkConsistency(slides);
  
  // 8. Accessibility
  scores.accessibility = checkAccessibility(slides);
  
  // Generate recommendations
  Object.entries(scores).forEach(([key, data]) => {
    if (data.score < 80) {
      recommendations.push(...data.issues.map(i => `${formatLabel(key)}: ${i}`));
    }
  });
  
  // Calculate overall score
  const overall = Object.values(scores).reduce((sum, s) => sum + s.score, 0) / Object.keys(scores).length;
  
  return {
    overall: Math.round(overall),
    grades: Object.fromEntries(
      Object.entries(scores).map(([k, v]) => [k, {
        score: v.score,
        issues: v.issues,
        grade: scoreToGrade(v.score)
      }])
    ),
    recommendations,
    slideCount: slides.length,
    analyzedAt: new Date().toISOString()
  };
}

function parseSlides(content) {
  const sections = content.split(/^---$/m);
  return sections.filter(s => s.trim()).map(s => s.trim());
}

function checkSingleIdeaPerSlide(slides) {
  const issues = [];
  let totalScore = 100;
  
  slides.forEach((slide, i) => {
    const h2Count = (slide.match(/^## /gm) || []).length;
    const bulletPoints = (slide.match(/^- /gm) || []).length;
    
    // Check for multiple headings (indicates multiple ideas)
    if (h2Count > 1) {
      issues.push(`Slide ${i + 1}: Multiple section headings suggest multiple ideas`);
      totalScore -= 8;
    }
    
    // Too many bullet points suggests cluttered slide
    if (bulletPoints > 7) {
      issues.push(`Slide ${i + 1}: ${bulletPoints} bullet points - consider reducing for clarity`);
      totalScore -= 5;
    }
    
    // Check for mixed content types
    const hasCode = slide.includes('```');
    const hasImage = slide.includes('![');
    const hasList = slide.includes('- ') || slide.includes('* ');
    const hasTable = slide.includes('| ');
    
    const contentTypes = [hasCode, hasImage, hasList, hasTable].filter(Boolean).length;
    if (contentTypes > 2) {
      issues.push(`Slide ${i + 1}: Multiple content types may reduce focus`);
      totalScore -= 5;
    }
  });
  
  return {
    score: Math.max(0, totalScore),
    issues: [...new Set(issues)].slice(0, 5)
  };
}

function checkVisualHierarchy(slides) {
  const issues = [];
  let totalScore = 100;
  
  slides.forEach((slide, i) => {
    const lines = slide.split('\n');
    const headings = lines.filter(l => /^#/.test(l));
    const bodyLines = lines.filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'));
    
    // Check for missing main heading
    if (headings.length === 0) {
      issues.push(`Slide ${i + 1}: No main heading`);
      totalScore -= 10;
    }
    
    // Check heading-to-text ratio
    if (headings.length > 0 && bodyLines.length === 0) {
      issues.push(`Slide ${i + 1}: Heading without supporting content`);
      totalScore -= 8;
    }
    
    // Check for very long paragraphs (bad for scanning)
    bodyLines.forEach(line => {
      if (line.length > 150) {
        issues.push(`Slide ${i + 1}: Long line may reduce readability`);
        totalScore -= 2;
      }
    });
  });
  
  return {
    score: Math.max(0, totalScore),
    issues: [...new Set(issues)].slice(0, 5)
  };
}

function checkWhitespace(content, slides) {
  const issues = [];
  let totalScore = 100;
  
  // Check for consistent line breaks
  const doubleNewlines = (content.match(/\n\n/g) || []).length;
  if (doubleNewlines < slides.length - 1) {
    issues.push('Inconsistent spacing between slides');
    totalScore -= 10;
  }
  
  // Check for code blocks (acceptable to be dense)
  slides.forEach((slide, i) => {
    const hasCodeBlock = slide.includes('```');
    const plainTextLines = slide.split('\n').filter(l => 
      l.trim() && !l.startsWith('#') && !l.startsWith('```') && !l.startsWith('<!--')
    );
    
    if (!hasCodeBlock && plainTextLines.some(l => l.length > 120)) {
      issues.push(`Slide ${i + 1}: Long lines without breaks`);
      totalScore -= 5;
    }
  });
  
  // Check for trailing whitespace consistency
  const linesWithTrailing = content.split('\n').filter(l => l !== l.trimRight());
  if (linesWithTrailing.length > content.split('\n').length * 0.1) {
    issues.push('Inconsistent trailing whitespace');
    totalScore -= 5;
  }
  
  return {
    score: Math.max(0, totalScore),
    issues: [...new Set(issues)].slice(0, 5)
  };
}

function checkColorPalette(content) {
  const issues = [];
  let totalScore = 100;
  
  // Extract inline style blocks
  const styleBlocks = content.match(/style:\s*\|([\s\S]*?)(?=---)/g) || [];
  
  // Look for color definitions
  const colors = [];
  styleBlocks.forEach(block => {
    const hexColors = block.match(/#[0-9a-fA-F]{3,6}/g) || [];
    colors.push(...hexColors);
  });
  
  // Check for excessive colors
  const uniqueColors = [...new Set(colors.map(c => c.toLowerCase()))];
  if (uniqueColors.length > 5) {
    issues.push(`Using ${uniqueColors.length} colors - consider limiting palette`);
    totalScore -= 15;
  }
  
  // Check for style block presence (suggests intentional styling)
  if (styleBlocks.length === 0 && colors.length === 0) {
    issues.push('No custom styles - using default theme colors');
    totalScore -= 5;
  }
  
  // Random gradients detection
  const gradients = content.match(/linear-gradient\([^)]+\)/g) || [];
  if (gradients.length > 5) {
    issues.push('Many gradients - ensure consistency');
    totalScore -= 5;
  }
  
  return {
    score: Math.max(0, totalScore),
    issues: [...new Set(issues)].slice(0, 3)
  };
}

function checkTypography(slides) {
  const issues = [];
  let totalScore = 100;
  
  slides.forEach((slide, i) => {
    // Check for heading patterns
    const h1Count = (slide.match(/^# [^/]/gm) || []).length;
    const h2Count = (slide.match(/^## /gm) || []).length;
    
    if (h1Count > 1) {
      issues.push(`Slide ${i + 1}: Multiple h1 headings`);
      totalScore -= 10;
    }
    
    // Check for all-caps headings (hard to read)
    const allCapsLines = slide.split('\n').filter(l => 
      /^#[^#]/.test(l) && l === l.toUpperCase() && l.length > 10
    );
    if (allCapsLines.length > 0) {
      issues.push(`Slide ${i + 1}: ALL CAPS heading - consider title case`);
      totalScore -= 5;
    }
    
    // Check for emoji-only headings
    const emojiOnly = slide.split('\n').filter(l => 
      /^#[^#]/.test(l) && /^#\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u.test(l)
    );
    if (emojiOnly.length > 0) {
      issues.push(`Slide ${i + 1}: Emoji-only heading - add text`);
      totalScore -= 5;
    }
  });
  
  return {
    score: Math.max(0, totalScore),
    issues: [...new Set(issues)].slice(0, 5)
  };
}

function checkMobileFirst(slides) {
  const issues = [];
  let totalScore = 100;
  
  slides.forEach((slide, i) => {
    const lines = slide.split('\n');
    const textHeavyLines = lines.filter(l => 
      l.trim().length > 80 && !l.startsWith('#')
    );
    
    if (textHeavyLines.length > 3) {
      issues.push(`Slide ${i + 1}: Dense text - mobile readers may struggle`);
      totalScore -= 8;
    }
    
    // Check for wide tables
    const tableLines = lines.filter(l => l.includes('|') && l.split('|').length > 4);
    if (tableLines.length > 0) {
      issues.push(`Slide ${i + 1}: Wide table may not fit mobile`);
      totalScore -= 10;
    }
  });
  
  return {
    score: Math.max(0, totalScore),
    issues: [...new Set(issues)].slice(0, 5)
  };
}

function checkConsistency(slides) {
  const issues = [];
  let totalScore = 100;
  
  if (slides.length < 2) {
    return { score: 100, issues: [] };
  }
  
  // Check heading patterns consistency
  const headingPatterns = slides.map(s => {
    const h1 = (s.match(/^# [^/]/gm) || []).length;
    const h2 = (s.match(/^## /gm) || []).length;
    return `${h1}-${h2}`;
  });
  
  const uniquePatterns = [...new Set(headingPatterns)];
  if (uniquePatterns.length > slides.length * 0.7) {
    issues.push('Inconsistent heading structure across slides');
    totalScore -= 15;
  }
  
  // Check for consistent bullet markers
  const bulletMarkers = slides.map(s => {
    if (s.includes('- ')) return 'dash';
    if (s.includes('* ')) return 'asterisk';
    if (s.includes('1. ')) return 'numbered';
    return 'none';
  });
  
  const uniqueMarkers = [...new Set(bulletMarkers)].filter(m => m !== 'none');
  if (uniqueMarkers.length > 2) {
    issues.push('Mixed bullet styles - consider consistent markers');
    totalScore -= 10;
  }
  
  // Check for consistent image placement
  const imagesPerSlide = slides.map(s => (s.match(/!\[/g) || []).length);
  const hasImages = imagesPerSlide.some(c => c > 0);
  if (hasImages) {
    const slidesWithImages = imagesPerSlide.filter(c => c > 0).length;
    if (slidesWithImages < slides.length * 0.3 && slides.length > 3) {
      issues.push('Sparse image usage - consider consistent visual rhythm');
      totalScore -= 8;
    }
  }
  
  return {
    score: Math.max(0, totalScore),
    issues: [...new Set(issues)].slice(0, 4)
  };
}

function checkAccessibility(slides) {
  const issues = [];
  let totalScore = 100;
  
  slides.forEach((slide, i) => {
    // Check for alt text on images
    const imagesWithoutAlt = (slide.match(/!\[[^\]]*\]\([^)]*\)(?![^[]*\[)/g) || [])
      .filter(img => !img.includes('[alt]') && !img.match(/!\[[^\]]*\|/));
    
    if (imagesWithoutAlt.length > 0) {
      issues.push(`Slide ${i + 1}: Image without descriptive alt text`);
      totalScore -= 8;
    }
    
    // Check for heading hierarchy (h1 should come before h2)
    const h1Pos = slide.indexOf('# ');
    const h2Pos = slide.indexOf('## ');
    
    if (h2Pos !== -1 && h1Pos === -1) {
      issues.push(`Slide ${i + 1}: h2 without preceding h1`);
      totalScore -= 10;
    }
    
    // Check for contrast in inline styles
    const darkOnDark = slide.match(/background:\s*#[0-3][0-9a-fA-F]{5}/g) || [];
    darkOnDark.forEach(() => {
      issues.push(`Slide ${i + 1}: Dark background may have contrast issues`);
      totalScore -= 5;
    });
  });
  
  return {
    score: Math.max(0, totalScore),
    issues: [...new Set(issues)].slice(0, 5)
  };
}

function scoreToGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function formatLabel(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

export function generateReport(analysisResult) {
  const { overall, grades, recommendations, slideCount } = analysisResult;
  const overallGrade = scoreToGrade(overall);
  
  let report = '';
  report += '═══════════════════════════════════════════════════\n';
  report += '         PRESENTATION QUALITY REPORT\n';
  report += '═══════════════════════════════════════════════════\n\n';
  report += `Overall Score: ${overall}/100 (${overallGrade})\n`;
  report += `Slides Analyzed: ${slideCount}\n\n`;
  
  report += '───────────────────────────────────────────────────\n';
  report += '  CATEGORY SCORES\n';
  report += '───────────────────────────────────────────────────\n';
  
  const sorted = Object.entries(grades).sort((a, b) => b[1].score - a[1].score);
  sorted.forEach(([name, data]) => {
    const bar = '█'.repeat(Math.floor(data.score / 10)) + '░'.repeat(10 - Math.floor(data.score / 10));
    report += `  ${formatLabel(name).padEnd(20)} ${bar} ${data.score} (${data.grade})\n`;
  });
  
  if (recommendations.length > 0) {
    report += '\n───────────────────────────────────────────────────\n';
    report += '  RECOMMENDATIONS\n';
    report += '───────────────────────────────────────────────────\n';
    recommendations.forEach((rec, i) => {
      report += `  ${i + 1}. ${rec}\n`;
    });
  }
  
  report += '\n═══════════════════════════════════════════════════\n';
  
  return report;
}

export function quickScore(markdown) {
  const result = analyzePresentation(markdown);
  return result.overall;
}