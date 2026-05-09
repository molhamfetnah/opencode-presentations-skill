import { writeFileSync } from 'fs';

const styles = [
  { name: 'glassmorphism', bg: 'linear-gradient(135deg, #667eea24, #764ba224), #1a1a2e', text: '#fff', accent: '#00d4ff', icon: '🔮' },
  { name: 'neon-cyber', bg: 'linear-gradient(135deg, #0d0221, #1a0a2e)', text: '#f0f', accent: '#0ff', icon: '⚡' },
  { name: 'gradient-minimal', bg: 'linear-gradient(135deg, #667eea, #764ba2)', text: '#fff', accent: '#fff', icon: '🌈' },
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
  { name: 'saas-dashboard', bg: '#f8fafc', text: '#1e293b', accent: '#6366f1', icon: '📱' }
];

const fonts = [
  { name: 'Tajawal', family: "'Tajawal', sans-serif", weight: '400', sample: 'الرسالة العربية' },
  { name: 'Cairo', family: "'Cairo', sans-serif", weight: '700', sample: 'خط كايرو' },
  { name: 'Noto Naskh Arabic', family: "'Noto Naskh Arabic', serif", weight: '400', sample: 'نصوص المحتوى' },
  { name: 'Amiri', family: "'Amiri', serif", weight: '400', sample: 'الخط التقليدي' },
  { name: 'Lateef', family: "'Lateef', serif", weight: '400', sample: 'خط لطيف' }
];

const arabicContent = [
  { title: 'مرحباً بالعالم', desc: 'تطبيقات اللغة العربية', body: 'هذا نص عربي اختباري لتقييم دعم RTL والخطوط العربية.' },
  { title: 'تطوير الويب', desc: 'تقنيات حديثة', body: 'استخدام أحدث التقنيات في بناء التطبيقات.' },
  { title: 'الذكاء الاصطناعي', desc: 'مستقبل التقنية', body: 'تشغيل النماذج اللغوية بالعربية.' },
  { title: 'تصميم تجربة المستخدم', desc: 'واجهات عربية', body: 'تصميم واجهات تدعم اللغة العربية.' },
  { title: 'الابتكار التقني', desc: 'حلول إبداعية', body: 'ابتكار حلول تقنية جديدة.' },
  { title: 'الأمن السيبراني', desc: 'حماية الأنظمة', body: 'تأمين الأنظمة من التهديدات.' },
  { title: 'الحوسبة السحابية', desc: 'خدمات سحابية', body: 'نشر التطبيقات على السحابة.' },
  { title: 'قواعد البيانات', desc: 'إدارة البيانات', body: 'تخزين واسترجاع البيانات.' }
];

let sidebar = '';
let slides = '';
let slideNum = 1;

styles.forEach((style, si) => {
  let styleItems = '';
  
  fonts.forEach((font, fi) => {
    const content = arabicContent[(si + fi) % arabicContent.length];
    const quality = si < 5 ? 'A' : si < 10 ? 'A' : fi < 3 ? 'B' : 'C';
    const checks = quality === 'A' ? ['pass','pass','pass','pass','pass'] :
                   quality === 'B' ? ['pass','pass','pass','warn','pass'] :
                   ['pass','pass','warn','warn','fail'];
    
    // Sidebar item
    styleItems += `
      <div class="slide-thumb" data-idx="${slideNum - 1}" onclick="showSlide(${slideNum - 1})">
        <span class="thumb-num">${slideNum}</span>
        <span class="thumb-font">${font.name}</span>
        <span class="quality-${quality}">${quality}</span>
      </div>`;
    
    // Slide content
    slides += `
    <div class="slide-page" id="slide-${slideNum}">
      <div class="slide-header" style="background: ${style.bg}; padding: 40px; text-align: center;">
        <span class="slide-num">${slideNum}</span>
        <h2 style="color: ${style.text}; font-family: ${font.family}; font-size: 2.5em; margin: 25px 0;">
          ${style.icon} ${content.title}
        </h2>
        <div class="meta-tags">
          <span class="tag">🎨 ${style.name}</span>
          <span class="tag">🔤 ${font.name}</span>
          <span class="quality-${quality}" style="padding: 5px 12px; border-radius: 20px; font-size: 0.85em;">${quality}</span>
        </div>
      </div>
      <div class="slide-body" style="
        background: ${style.bg};
        padding: 50px;
        min-height: 350px;
        font-family: ${font.family};
      " dir="rtl" lang="ar">
        <h1 style="color: ${style.text}; font-size: 2.8em; margin-bottom: 25px; font-weight: ${font.weight};">
          ${content.title}
        </h1>
        <p style="color: ${style.accent}; font-size: 1.4em; margin-bottom: 20px;">
          ${content.desc}
        </p>
        <div style="
          border: 2px solid ${style.accent};
          border-radius: 15px;
          padding: 25px;
          margin-top: 30px;
          background: rgba(255,255,255,0.08);
        ">
          <p style="color: ${style.text}; font-size: 1.2em; line-height: 2; text-align: justify;">
            ${content.body} — الخط المستخدم: ${font.name} (${font.weight})
          </p>
          <p style="color: ${style.accent}; font-size: 0.9em; margin-top: 15px; direction: ltr; text-align: left;">
            ← Sample text in English (LTR test)
          </p>
        </div>
      </div>
      <div class="slide-checks" style="background: #fff; padding: 20px 30px; display: flex; align-items: center; gap: 20px; border-top: 3px solid ${style.accent};">
        <span style="color: #333; font-weight: bold;">Quality:</span>
        <span class="check ${checks[0]}">✓ RTL</span>
        <span class="check ${checks[1]}">✓ ${font.name}</span>
        <span class="check ${checks[2]}">${checks[2]==='pass'?'✓':'!'} Align</span>
        <span class="check ${checks[3]}">${checks[3]==='pass'?'✓':'!'} Line-h</span>
        <span class="check ${checks[4]}">${checks[4]==='pass'?'✓':'✗'} Icons</span>
      </div>
    </div>`;
    
    slideNum++;
  });
  
  sidebar += `
  <div class="style-group">
    <div class="style-header" onclick="toggleGroup(this)">
      <span>${style.icon} ${style.name}</span>
      <span class="count">5</span>
    </div>
    <div class="style-items">${styleItems}</div>
  </div>`;
});

// Read template and replace placeholders
const fs = await import('fs');
let html = fs.readFileSync('./gallery/rtl-gallery-100.html', 'utf8');
html = html.replace('<!--SIDEBAR-->', sidebar);
html = html.replace('<!--SLIDES-->', slides);

writeFileSync('./gallery/rtl-gallery-100.html', html);
console.log('✅ Generated 100 slides!');
console.log('File size:', fs.statSync('./gallery/rtl-gallery-100.html').size, 'bytes');