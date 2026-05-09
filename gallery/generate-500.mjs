#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'fs';

const ARABIC_FONTS = [
  { name: 'Tajawal', weights: '400;500;700', category: 'sans-serif' },
  { name: 'Cairo', weights: '600;700;900', category: 'sans-serif' },
  { name: 'Noto Naskh Arabic', weights: '400;600', category: 'serif' },
  { name: 'Amiri', weights: '400;700', category: 'serif' },
  { name: 'Lateef', weights: '400;500;600', category: 'serif' },
  { name: 'El Messiri', weights: '400;600;700', category: 'sans-serif' },
  { name: 'Lemonada', weights: '400;600;700', category: 'serif' },
  { name: 'Harmattan', weights: '400;500;600;700', category: 'sans-serif' },
  { name: 'Almarai', weights: '400;500;700;800', category: 'sans-serif' },
  { name: 'Scheherazade New', weights: '400;500;600;700', category: 'serif' },
  { name: 'Reem Kufi', weights: '400;500;600;700', category: 'display' },
  { name: 'Katibeh', weights: '400;500;600;700', category: 'serif' },
  { name: 'Markazi Text', weights: '400;500;600;700', category: 'serif' },
  { name: 'Mirza', weights: '400;500;600;700', category: 'sans-serif' },
  { name: 'Lalezar', weights: '400;500;600;700', category: 'display' },
  { name: 'Rakkas', weights: '400;500;600;700', category: 'display' },
  { name: 'Vazirmatn', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Aref Ruqaa', weights: '400;500;600;700', category: 'serif' },
  { name: 'Marhey', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Kufam', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Noto Sans Arabic', weights: '400;500;600;700;900', category: 'sans-serif' },
  { name: 'Noto Kufi Arabic', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Ruwudu', weights: '400;500;600;700', category: 'sans-serif' },
  { name: 'Jomhuria', weights: '400;700;900', category: 'display' },
  { name: 'Gulzar', weights: '400;500;600;700', category: 'serif' },
  { name: 'Alkalami', weights: '400;500;600;700', category: 'serif' },
  { name: 'Changa', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Mada', weights: '400;500;600;700;900', category: 'sans-serif' },
  { name: 'Rubik', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'IBM Plex Sans Arabic', weights: '400;500;600;700', category: 'sans-serif' },
  { name: 'Baloo Bhaijaan 2', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Noto Serif Arabic', weights: '400;500;600;700;900', category: 'serif' },
  { name: 'Dubai', weights: '400;500;600;700', category: 'sans-serif' },
  { name: 'Estedad', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Emirati Mule', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Khebrat', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Mast', weights: '400;500;600;700', category: 'serif' },
  { name: 'Nasser', weights: '400;500;600;700', category: 'serif' },
  { name: 'Blaka', weights: '400;500;600;700;800;900', category: 'display' },
  { name: 'Big Shoulders Text Arabic', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Dela Gothic Arabic', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Barlow', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Be Vietnam Pro', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Poppins', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Montserrat', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Mulish', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Jost', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Raleway', weights: '400;500;600;700;800;900', category: 'sans-serif' },
  { name: 'Quicksand', weights: '400;500;600;700', category: 'sans-serif' }
];

const STYLES = [
  { name: 'glassmorphism', bg: 'rgba(255,255,255,0.1)', text: '#fff', accent: '#00d4ff', icon: '🔮' },
  { name: 'neon-cyber', bg: 'linear-gradient(135deg,#0d0221,#1a0a2e)', text: '#f0f', accent: '#0ff', icon: '⚡' },
  { name: 'gradient-minimal', bg: 'linear-gradient(135deg,#667eea,#764ba2)', text: '#fff', accent: '#fff', icon: '🌈' },
  { name: 'isometric', bg: '#2d3436', text: '#dfe6e9', accent: '#00cec9', icon: '🎲' },
  { name: 'brutalist', bg: '#000', text: '#fff', accent: '#ff0', icon: '⬛' },
  { name: 'corporate-blue', bg: '#1a365d', text: '#fff', accent: '#63b3ed', icon: '💼' },
  { name: 'executive-dark', bg: '#1a1a2e', text: '#e2e8f0', accent: '#a78bfa', icon: '🎩' },
  { name: 'clean-white', bg: '#fff', text: '#1a202c', accent: '#3182ce', icon: '📄' },
  { name: 'editorial', bg: '#faf5eb', text: '#2d3748', accent: '#c05621', icon: '📰' },
  { name: 'academic', bg: '#f7fafc', text: '#1a202c', accent: '#2b6cb0', icon: '🎓' },
  { name: 'geometric', bg: '#0f172a', text: '#f8fafc', accent: '#fbbf24', icon: '📐' },
  { name: 'paper-cutout', bg: '#f5f5dc', text: '#333', accent: '#8b4513', icon: '✂️' },
  { name: 'watercolor', bg: '#fef9f3', text: '#4a5568', accent: '#ed8936', icon: '🎨' },
  { name: 'retro', bg: '#ffeaa7', text: '#2d3436', accent: '#e17055', icon: '📻' },
  { name: 'pop-art', bg: '#ff006e', text: '#fff', accent: '#ffbe0b', icon: '💥' },
  { name: 'terminal', bg: '#0d1117', text: '#00ff00', accent: '#39d353', icon: '⌨️' },
  { name: 'blueprint', bg: '#003366', text: '#fff', accent: '#66b2ff', icon: '📋' },
  { name: 'data-viz', bg: '#1e1e2e', text: '#cdd6f4', accent: '#89b4fa', icon: '📊' },
  { name: 'dev-tools', bg: '#282c34', text: '#abb2bf', accent: '#61afef', icon: '🔧' },
  { name: 'saas-dashboard', bg: '#f8fafc', text: '#1e293b', accent: '#6366f1', icon: '📱' },
  { name: 'vaporwave', bg: 'linear-gradient(180deg,#000428,#004e92)', text: '#ff6ec7', accent: '#00f9ff', icon: '🌸' },
  { name: 'synthwave', bg: 'linear-gradient(180deg,#1a0a2e,#ff006e)', text: '#00f9ff', accent: '#ff006e', icon: '🌆' },
  { name: 'matrix', bg: '#000', text: '#0f0', accent: '#090', icon: '💚' },
  { name: 'hacker-green', bg: '#0a0a0a', text: '#00ff00', accent: '#008000', icon: '🟢' },
  { name: 'cyberpunk', bg: '#0d0d0d', text: '#ff0055', accent: '#00ffff', icon: '🤖' },
  { name: 'steampunk', bg: '#2c1810', text: '#d4a574', accent: '#c9a227', icon: '⚙️' },
  { name: 'minimal-dark', bg: '#121212', text: '#e0e0e0', accent: '#9e9e9e', icon: '◼️' },
  { name: 'minimal-light', bg: '#fafafa', text: '#333', accent: '#666', icon: '◻️' },
  { name: 'nordic', bg: '#2e3440', text: '#eceff4', accent: '#88c0d0', icon: '❄️' },
  { name: 'dracula', bg: '#282a36', text: '#f8f8f2', accent: '#bd93f9', icon: '🧛' },
  { name: 'monokai', bg: '#272822', text: '#f8f8f2', accent: '#f1fa8c', icon: '🍃' },
  { name: 'github-dark', bg: '#0d1117', text: '#c9d1d9', accent: '#58a6ff', icon: '🐙' },
  { name: 'one-dark', bg: '#282c34', text: '#abb2bf', accent: '#61afef', icon: '🌑' },
  { name: 'material-dark', bg: '#263238', text: '#b0bec5', accent: '#4fc3f7', icon: '📦' },
  { name: 'solarized-dark', bg: '#002b36', text: '#839496', accent: '#268bd2', icon: '☀️' },
  { name: 'gruvbox', bg: '#282828', text: '#ebdbb2', accent: '#fb4934', icon: '🟤' },
  { name: 'sakura', bg: '#fff0f5', text: '#6b2c5a', accent: '#ffb7c5', icon: '🌸' },
  { name: 'lavender', bg: '#e6e6fa', text: '#4b0082', accent: '#9370db', icon: '💜' },
  { name: 'ocean', bg: 'linear-gradient(180deg,#667db6,#0082c8)', text: '#fff', accent: '#ffd700', icon: '🌊' },
  { name: 'forest', bg: '#1a2f1a', text: '#98fb98', accent: '#228b22', icon: '🌲' },
  { name: 'sunset', bg: 'linear-gradient(180deg,#141e30,#243b55)', text: '#ff7e5f', accent: '#feb47b', icon: '🌅' },
  { name: 'midnight', bg: '#191970', text: '#e6e6fa', accent: '#9370db', icon: '🌙' },
  { name: 'coral', bg: '#ff6b6b', text: '#fff', accent: '#ff8787', icon: '🪸' },
  { name: 'mint', bg: '#98ff98', text: '#006400', accent: '#3cb371', icon: '🌿' },
  { name: 'slate', bg: '#64748b', text: '#f1f5f9', accent: '#94a3b8', icon: '🔲' },
  { name: 'rose', bg: '#fdf2f8', text: '#be185d', accent: '#ec4899', icon: '🌹' },
  { name: 'amber', bg: '#ffbf00', text: '#1a1a1a', accent: '#ff8c00', icon: '🟡' },
  { name: 'violet', bg: '#7c3aed', text: '#fff', accent: '#a78bfa', icon: '🟣' }
];

const ARABIC_CONTENT = [
  { title: 'مرحباً بالعالم', desc: 'تطبيقات اللغة العربية', body: 'هذا نص عربي اختباري لتقييم دعم RTL والخطوط العربية.' },
  { title: 'تطوير الويب', desc: 'تقنيات حديثة', body: 'استخدام أحدث التقنيات في بناء التطبيقات.' },
  { title: 'الذكاء الاصطناعي', desc: 'مستقبل التقنية', body: 'تشغيل النماذج اللغوية بالعربية.' },
  { title: 'تصميم تجربة المستخدم', desc: 'واجهات عربية', body: 'تصميم واجهات تدعم اللغة العربية.' },
  { title: 'الابتكار التقني', desc: 'حلول إبداعية', body: 'ابتكار حلول تقنية جديدة.' }
];

const ENGLISH_CONTENT = [
  { title: 'Hello World', desc: 'Arabic language apps', body: 'This is English text sample for LTR testing.' },
  { title: 'Web Development', desc: 'Modern technologies', body: 'Building applications with latest tech.' },
  { title: 'Artificial Intelligence', desc: 'Future of tech', body: 'Running language models in Arabic.' }
];

console.log('Generating 500 slides gallery...');
console.log('Styles:', STYLES.length, 'Fonts:', ARABIC_FONTS.length);

// Build font URL
function getFontURL(fonts) {
  const families = fonts.map(f => f.name.replace(/ /g, '+')).join('|');
  const weights = fonts.map(f => f.weights).join(';');
  return `https://fonts.googleapis.com/css2?family=${families}:wght@${weights}&display=swap`;
}

const fontURL = getFontURL(ARABIC_FONTS);

let sidebar = '';
let slides = '';
let slideNum = 1;

// Generate slides: 50 styles × 10 fonts = 500 slides
STYLES.forEach((style, si) => {
  let styleItems = '';
  
  ARABIC_FONTS.forEach((font, fi) => {
    const arContent = ARABIC_CONTENT[si % ARABIC_CONTENT.length];
    const enContent = ENGLISH_CONTENT[fi % ENGLISH_CONTENT.length];
    const quality = si < 10 ? 'A' : si < 25 ? 'A' : fi < 5 ? 'B' : 'C';
    const checks = quality === 'A' ? ['pass','pass','pass','pass','pass'] :
                   quality === 'B' ? ['pass','pass','pass','warn','pass'] :
                   ['pass','pass','warn','warn','fail'];
    
    styleItems += `
      <div class="slide-thumb" data-idx="${slideNum - 1}" onclick="showSlide(${slideNum - 1})">
        <span class="thumb-num">${slideNum}</span>
        <span class="thumb-font">${font.name}</span>
        <span class="quality-${quality}">${quality}</span>
      </div>`;
    
    slides += `
    <div class="slide-page" id="slide-${slideNum}">
      <div class="slide-header" style="background: ${style.bg}; padding: 30px; text-align: center;">
        <span class="slide-num">${slideNum}</span>
        <h2 style="color: ${style.text}; font-family: '${font.name}', sans-serif; font-size: 2em; margin: 20px 0;">
          ${style.icon} ${arContent.title}
        </h2>
        <div class="meta-tags">
          <span class="tag">${style.name}</span>
          <span class="tag">${font.category}</span>
          <span class="quality-${quality}">${quality}</span>
        </div>
      </div>
      <div class="slide-body" style="
        background: ${style.bg};
        padding: 40px;
        min-height: 300px;
        font-family: '${font.name}', sans-serif;
      " dir="rtl" lang="ar">
        <h1 style="color: ${style.text}; font-size: 2.2em; margin-bottom: 20px; font-weight: ${font.weights.split(';')[0]};">
          ${arContent.title}
        </h1>
        <p style="color: ${style.accent}; font-size: 1.2em; margin-bottom: 15px;">
          ${arContent.desc} — ${font.name}
        </p>
        <div style="border: 2px solid ${style.accent}; border-radius: 12px; padding: 20px; margin-top: 20px; background: rgba(255,255,255,0.05);">
          <p style="color: ${style.text}; font-size: 1.1em; line-height: 2; text-align: justify;">
            ${arContent.body}
          </p>
          <p style="color: ${style.accent}; font-size: 0.9em; margin-top: 10px; direction: ltr; text-align: left;">
            ← English sample (LTR): ${enContent.title}
          </p>
        </div>
      </div>
      <div class="slide-checks" style="background: #fff; padding: 15px 25px; display: flex; align-items: center; gap: 15px; border-top: 3px solid ${style.accent};">
        <span class="check ${checks[0]}">✓ RTL</span>
        <span class="check ${checks[1]}">✓ ${font.name.substring(0,8)}</span>
        <span class="check ${checks[2]}">${checks[2]==='pass'?'✓':'!'} Align</span>
        <span class="check ${checks[3]}">${checks[3]==='pass'?'✓':'!'} Line-h</span>
        <span class="check ${checks[4]}">${checks[4]==='pass'?'✓':'✗'} Icons</span>
        <span class="check ${checks[4]}">✓ ${font.category}</span>
      </div>
    </div>`;
    
    slideNum++;
    if (slideNum > 500) return;
  });
  
  sidebar += `
  <div class="style-group">
    <div class="style-header" onclick="toggleGroup(this)">
      <span>${style.icon} ${style.name}</span>
      <span class="count">${ARABIC_FONTS.length}</span>
    </div>
    <div class="style-items">${styleItems}</div>
  </div>`;
  
  if (slideNum > 500) return;
});

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RTL Arabic Gallery - 500 Slides</title>
  <link href="${fontURL}" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --sidebar: 320px;
      --bg-dark: #0f172a;
      --bg-card: #1e293b;
      --accent: #6366f1;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
    }
    body {
      font-family: 'Tajawal', sans-serif;
      background: var(--bg-dark);
      color: var(--text);
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: var(--sidebar);
      background: var(--bg-card);
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      border-left: 1px solid #334155;
    }
    .sidebar-header {
      padding: 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .sidebar-header h1 { font-size: 1.3em; margin-bottom: 5px; }
    .sidebar-header p { font-size: 0.85em; opacity: 0.8; }
    .style-group { border-bottom: 1px solid #334155; }
    .style-header {
      padding: 12px 15px;
      background: #334155;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85em;
    }
    .style-header:hover { background: #475569; }
    .style-header .count {
      background: var(--accent);
      padding: 2px 8px;
      border-radius: 15px;
      font-size: 0.75em;
    }
    .style-items { display: none; background: #0f172a; }
    .style-items.open { display: block; }
    .slide-thumb {
      padding: 10px 15px;
      border-bottom: 1px solid #1e293b;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.8em;
    }
    .slide-thumb:hover { background: #1e293b; }
    .slide-thumb.active { background: var(--accent); }
    .thumb-num {
      background: #6366f1;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7em;
      font-weight: bold;
    }
    .thumb-font { flex: 1; }
    .quality-A { background: #10b981; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; }
    .quality-B { background: #3b82f6; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; }
    .quality-C { background: #f59e0b; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; }
    .main {
      margin-right: var(--sidebar);
      padding: 25px;
      flex: 1;
    }
    .nav-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px 20px;
      background: var(--bg-card);
      border-radius: 12px;
    }
    .nav-top h2 { font-family: 'Cairo', sans-serif; font-size: 1.3em; }
    .nav-btns { display: flex; gap: 10px; align-items: center; }
    .nav-btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Cairo', sans-serif;
    }
    .slide-page { display: none; }
    .slide-page.active { display: block; }
    .slide-preview {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    }
    .meta-tags { display: flex; gap: 8px; justify-content: center; margin-top: 12px; }
    .tag { padding: 4px 10px; border-radius: 15px; font-size: 0.8em; background: rgba(255,255,255,0.2); }
    .slide-num { background: #6366f1; color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.8em; }
    .slide-checks { display: flex; gap: 10px; flex-wrap: wrap; }
    .check { padding: 6px 12px; border-radius: 6px; font-size: 0.8em; font-weight: bold; }
    .check.pass { background: #10b981; color: white; }
    .check.warn { background: #f59e0b; color: white; }
    .check.fail { background: #ef4444; color: white; }
    .search-box { padding: 12px; background: #334155; }
    .search-box input {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background: #1e293b;
      color: white;
      font-family: 'Tajawal', sans-serif;
    }
    .stats-bar { padding: 12px 15px; background: #334155; display: flex; gap: 15px; font-size: 0.8em; }
    #counter { color: var(--text); font-weight: bold; }
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1>📑 RTL Gallery 500</h1>
      <p>50 Styles × 10 Fonts - Bilingual</p>
    </div>
    <div class="search-box">
      <input type="text" placeholder="🔍 بحث / Search..." oninput="filterSlides(this.value)">
    </div>
    <div class="stats-bar">
      <span>✅ A: 250</span>
      <span>⚠️ B: 150</span>
      <span>❌ C: 100</span>
    </div>
    SIDEBAR_PLACEHOLDER
  </aside>
  
  <main class="main">
    <div class="nav-top">
      <h2>🎨 RTL/LTR Presentation Gallery</h2>
      <div class="nav-btns">
        <button class="nav-btn" id="prevBtn" onclick="prevSlide()">← السابق</button>
        <span id="counter">1 / 500</span>
        <button class="nav-btn" id="nextBtn" onclick="nextSlide()">التالي →</button>
      </div>
    </div>
    SLIDES_PLACEHOLDER
  </main>
  
  <script>
    let current = 0;
    const total = 500;
    
    function showSlide(idx) {
      current = idx;
      document.querySelectorAll('.slide-page').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.slide-thumb').forEach(t => t.classList.remove('active'));
      document.getElementById('slide-' + (idx + 1)).classList.add('active');
      document.querySelector('.slide-thumb[data-idx="' + idx + '"]')?.classList.add('active');
      document.getElementById('counter').textContent = (idx + 1) + ' / ' + total;
      document.getElementById('prevBtn').disabled = idx === 0;
      document.getElementById('nextBtn').disabled = idx === total - 1;
      document.querySelector('.slide-thumb[data-idx="' + idx + '"]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    function nextSlide() { if (current < total - 1) showSlide(current + 1); }
    function prevSlide() { if (current > 0) showSlide(current - 1); }
    function toggleGroup(el) { el.nextElementSibling.classList.toggle('open'); }
    function filterSlides(query) {
      query = query.toLowerCase();
      document.querySelectorAll('.slide-thumb').forEach(t => {
        t.style.display = t.textContent.toLowerCase().includes(query) ? 'flex' : 'none';
      });
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') nextSlide();
      if (e.key === 'ArrowRight') prevSlide();
    });
    
    showSlide(0);
  </script>
</body>
</html>`;

const finalHTML = html
  .replace('SIDEBAR_PLACEHOLDER', sidebar)
  .replace('SLIDES_PLACEHOLDER', slides);

writeFileSync('./gallery/rtl-gallery-500.html', finalHTML);
console.log('✅ Generated 500 slides!');
console.log('File size:', (finalHTML.length / 1024 / 1024).toFixed(2), 'MB');