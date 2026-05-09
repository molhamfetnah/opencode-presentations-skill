#!/usr/bin/env node

import { writeFileSync, readFileSync } from 'fs';

const html = readFileSync('./gallery/rtl-gallery-500.html', 'utf8');

const newFeatures = `
  <!-- Export & Evaluation Tools -->
  <div id="evalTools" style="
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  ">
    <button onclick="exportPDF()" style="
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Cairo', sans-serif;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(239,68,68,0.4);
    ">📄 Export PDF</button>
    
    <button onclick="exportJSON()" style="
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Cairo', sans-serif;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(16,185,129,0.4);
    ">📋 Export JSON</button>
    
    <button onclick="exportCSV()" style="
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Cairo', sans-serif;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(59,130,246,0.4);
    ">📊 Export CSV</button>
    
    <button onclick="generateReport()" style="
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Cairo', sans-serif;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(139,92,246,0.4);
    ">📝 Quality Report</button>
    
    <button onclick="toggleCompare()" style="
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Cairo', sans-serif;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(245,158,11,0.4);
    ">⚖️ Compare Mode</button>
    
    <button onclick="filterByGrade('A')" style="
      background: #10b981;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85em;
    ">✅ Grade A</button>
    
    <button onclick="filterByGrade('B')" style="
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85em;
    ">⚠️ Grade B</button>
    
    <button onclick="filterByGrade('C')" style="
      background: #f59e0b;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85em;
    ">❌ Grade C</button>
    
    <button onclick="showAll()" style="
      background: #6366f1;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85em;
    ">👁️ Show All</button>
  </div>

  <!-- Compare Panel -->
  <div id="comparePanel" style="
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.9);
    z-index: 2000;
    padding: 30px;
  ">
    <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
      <button onclick="toggleCompare()" style="
        background: #ef4444;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
      ">✕ إغلاق</button>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100vh - 100px);">
      <div id="compareLeft" style="background: white; border-radius: 16px; overflow: auto;"></div>
      <div id="compareRight" style="background: white; border-radius: 16px; overflow: auto;"></div>
    </div>
    <div style="text-align: center; margin-top: 20px; color: white;">
      <p>اختر شرطتين للمقارنة | Select two slides to compare</p>
      <button onclick="autoCompare()" style="
        background: #8b5cf6;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1.1em;
      ">🔄 مقارنة تلقائية | Auto Compare</button>
    </div>
  </div>

  <!-- Report Modal -->
  <div id="reportModal" style="
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #1e293b;
    border-radius: 20px;
    padding: 30px;
    max-width: 800px;
    width: 90%;
    max-height: 80vh;
    overflow: auto;
    z-index: 3000;
    box-shadow: 0 25px 80px rgba(0,0,0,0.5);
  ">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="color: white; font-family: 'Cairo', sans-serif;">📊 تقرير الجودة | Quality Report</h2>
      <button onclick="closeReport()" style="
        background: #ef4444;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 8px;
        cursor: pointer;
      ">✕</button>
    </div>
    <div id="reportContent" style="color: #e2e8f0;"></div>
    <div style="display: flex; gap: 15px; margin-top: 20px;">
      <button onclick="downloadReport('txt')" style="
        background: #6366f1;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 10px;
        cursor: pointer;
      ">📄 تنزيل TXT</button>
      <button onclick="downloadReport('md')" style="
        background: #10b981;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 10px;
        cursor: pointer;
      ">📝 تنزيل Markdown</button>
    </div>
  </div>
`;

// Add new CSS
const newCSS = `
  /* Floating Toolbar */
  #evalTools button:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
  }
  
  /* Report Styles */
  .report-section {
    background: #0f172a;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
  }
  .report-section h3 {
    color: #6366f1;
    margin-bottom: 10px;
  }
  .report-stat {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #334155;
  }
  .report-stat:last-child { border-bottom: none; }
  .bar {
    background: #334155;
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 5px;
  }
  .bar-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.5s;
  }
  .bar-a { background: linear-gradient(90deg, #10b981, #34d399); }
  .bar-b { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
  .bar-c { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
`;

// Inject features
let modified = html.replace('</head>', `<style>${newCSS}</style></head>`);
modified = modified.replace('<main class="main">', `${newFeatures}<main class="main">`);

// Add new JS functions before closing script
const newJS = `
    // Export Functions
    function exportPDF() {
      alert('📄 For PDF export, use browser print (Ctrl+P) and select "Save as PDF"');
      window.print();
    }
    
    function exportJSON() {
      const data = [];
      document.querySelectorAll('.slide-page').forEach((slide, i) => {
        const header = slide.querySelector('.slide-header h2');
        const style = slide.dataset.style;
        const font = slide.dataset.font;
        const checks = slide.querySelectorAll('.check');
        data.push({
          id: i + 1,
          title: header ? header.textContent : 'Slide ' + (i + 1),
          style: style,
          font: font,
          rtl: checks[0].classList.contains('pass'),
          fontLoaded: checks[1].classList.contains('pass'),
          alignment: checks[2].classList.contains('pass'),
          lineHeight: checks[3].classList.contains('pass'),
          icons: checks[4].classList.contains('pass')
        });
      });
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rtl-gallery-data.json';
      a.click();
    }
    
    function exportCSV() {
      let csv = 'ID,Style,Font,RTL,Font Load,Alignment,Line Height,Icons,Grade\\n';
      document.querySelectorAll('.slide-page').forEach((slide, i) => {
        const style = slide.dataset.style || '';
        const font = slide.dataset.font || '';
        const checks = slide.querySelectorAll('.check');
        const grade = slide.querySelector('.quality-A, .quality-B, .quality-C');
        const gradeVal = grade ? grade.textContent : '';
        csv += \`\${i+1},\${style},\${font},\${checks[0].classList.contains('pass')},\${checks[1].classList.contains('pass')},\${checks[2].classList.contains('pass')},\${checks[3].classList.contains('pass')},\${checks[4].classList.contains('pass')},\${gradeVal}\\n\`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rtl-gallery-data.csv';
      a.click();
    }
    
    function generateReport() {
      let stats = { total: 500, A: 0, B: 0, C: 0, styles: {}, fonts: {}, issues: [] };
      
      document.querySelectorAll('.quality-A, .quality-B, .quality-C').forEach(el => {
        if (el.classList.contains('quality-A')) stats.A++;
        if (el.classList.contains('quality-B')) stats.B++;
        if (el.classList.contains('quality-C')) stats.C++;
      });
      
      document.querySelectorAll('.slide-page').forEach(slide => {
        const style = slide.dataset.style;
        const font = slide.dataset.font;
        if (!stats.styles[style]) stats.styles[style] = 0;
        stats.styles[style]++;
        if (!stats.fonts[font]) stats.fonts[font] = 0;
        stats.fonts[font]++;
        
        slide.querySelectorAll('.check.fail').forEach(c => {
          stats.issues.push({ slide: slide.id, issue: c.textContent });
        });
      });
      
      const reportHTML = \`
        <div class="report-section">
          <h3>📈 ملخص عام | Overall Summary</h3>
          <div class="report-stat"><span>إجمالي الشرائح</span><span>\${stats.total}</span></div>
          <div class="report-stat"><span>✅ Grade A</span><span>\${stats.A} (\${(stats.A/stats.total*100).toFixed(1)}%)</span></div>
          <div class="report-stat"><span>⚠️ Grade B</span><span>\${stats.B} (\${(stats.B/stats.total*100).toFixed(1)}%)</span></div>
          <div class="report-stat"><span>❌ Grade C</span><span>\${stats.C} (\${(stats.C/stats.total*100).toFixed(1)}%)</span></div>
          <div class="bar"><div class="bar-fill" style="width:\${stats.A/5}%; background: #10b981;"></div></div>
        </div>
        
        <div class="report-section">
          <h3>🎨 أنماط التصميم | Design Styles</h3>
          \${Object.entries(stats.styles).slice(0, 10).map(([k,v]) => 
            \`<div class="report-stat"><span>\${k}</span><span>\${v} slides</span></div>\`
          ).join('')}
        </div>
        
        <div class="report-section">
          <h3>🔤 الخطوط العربية | Arabic Fonts</h3>
          \${Object.entries(stats.fonts).slice(0, 10).map(([k,v]) => 
            \`<div class="report-stat"><span>\${k}</span><span>\${v} slides</span></div>\`
          ).join('')}
        </div>
        
        <div class="report-section">
          <h3>⚠️ المشاكل المكتشفة | Issues Found</h3>
          <p style="color: #94a3b8;">عدد المشاكل: \${stats.issues.length}</p>
          \${stats.issues.slice(0, 20).map(i => 
            \`<div class="report-stat"><span>\${i.slide}</span><span>\${i.issue}</span></div>\`
          ).join('')}
        </div>
      \`;
      
      document.getElementById('reportContent').innerHTML = reportHTML;
      document.getElementById('reportModal').style.display = 'block';
    }
    
    function closeReport() {
      document.getElementById('reportModal').style.display = 'none';
    }
    
    function downloadReport(format) {
      let content = '# RTL Gallery 500 - Quality Report\\n\\n';
      content += 'Generated: ' + new Date().toISOString() + '\\n\\n';
      content += document.getElementById('reportContent').textContent;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quality-report.' + format;
      a.click();
    }
    
    function toggleCompare() {
      const panel = document.getElementById('comparePanel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
    
    function autoCompare() {
      document.querySelectorAll('.slide-thumb').forEach(t => t.onclick = function() {
        const idx = parseInt(this.dataset.idx);
        if (!window.compareSelected) {
          window.compareSelected = idx;
          document.getElementById('compareLeft').innerHTML = document.getElementById('slide-' + (idx + 1)).outerHTML;
        } else {
          document.getElementById('compareRight').innerHTML = document.getElementById('slide-' + (idx + 1)).outerHTML;
          window.compareSelected = null;
        }
      });
    }
    
    function filterByGrade(grade) {
      document.querySelectorAll('.slide-thumb').forEach(t => {
        const qualityEl = t.querySelector('.quality-' + grade);
        t.style.display = qualityEl ? 'flex' : 'none';
      });
    }
    
    function showAll() {
      document.querySelectorAll('.slide-thumb').forEach(t => {
        t.style.display = 'flex';
      });
    }
`;

modified = modified.replace('showSlide(0);', 'showSlide(0);' + newJS);

writeFileSync('./gallery/rtl-gallery-500.html', modified);
console.log('✅ Added export & evaluation tools!');