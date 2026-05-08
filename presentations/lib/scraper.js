const SCRAPE_SOURCES = {
  dribbble: {
    url: 'https://dribbble.com/shots/popular',
    selector: '.shot-img'
  },
  behance: {
    url: 'https://www.behance.net/featured',
    selector: '.ProjectCoverNeue'
  },
  awwwards: {
    url: 'https://www.awwwards.com/websites/',
    selector: '.site-blocksite'
  }
};

export async function scrapeDesigns(source = 'dribbble', count = 10) {
  let puppeteer;
  
  try {
    const module = await import('puppeteer');
    puppeteer = module.default || module;
  } catch (e) {
    console.error('Error: Puppeteer not installed');
    console.error('Install with: npm install puppeteer');
    throw new Error('Puppeteer required for web scraping');
  }
  
  const config = SCRAPE_SOURCES[source] || SCRAPE_SOURCES.dribbble;
  const styles = [];
  
  let browser;
  try {
    console.log(`Launching browser for ${config.url}...`);
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(config.url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    const elements = await page.$$(config.selector);
    const limited = elements.slice(0, Math.min(count, elements.length));
    
    console.log(`Found ${elements.length} elements, scraping ${limited.length}...`);
    
    for (let i = 0; i < limited.length; i++) {
      const style = await limited[i].evaluate(node => {
        const computed = window.getComputedStyle(node);
        const styleData = {
          index: i,
          backgroundColor: computed.backgroundColor,
          backgroundImage: computed.backgroundImage,
          color: computed.color,
          fontFamily: computed.fontFamily,
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow,
          backgroundSize: computed.backgroundSize
        };
        
        if (node.tagName === 'IMG' || node.querySelector('img')) {
          const img = node.querySelector('img') || node;
          styleData.src = img.src || img.getAttribute('data-src');
        }
        
        return styleData;
      });
      styles.push(style);
      
      if ((i + 1) % 5 === 0) {
        console.log(`  Scraped ${i + 1}/${limited.length}...`);
      }
    }
    
    return styles;
  } catch (e) {
    console.error('Scraping error:', e.message);
    throw e;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export function getSources() {
  return Object.keys(SCRAPE_SOURCES);
}

export function getSourceConfig(source) {
  return SCRAPE_SOURCES[source] || SCRAPE_SOURCES.dribbble;
}