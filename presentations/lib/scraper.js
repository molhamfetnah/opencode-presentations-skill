let puppeteer;

async function initPuppeteer() {
  if (!puppeteer) {
    try {
      puppeteer = await import('puppeteer');
    } catch (e) {
      console.log('Puppeteer not installed. Run: npm install puppeteer');
      return null;
    }
  }
  return puppeteer;
}

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
    selector: '. Osc-tabContent'
  }
};

export async function scrapeDesigns(source = 'dribbble', count = 10) {
  const { browser, page } = await initPuppeteer();
  if (!browser) return [];
  
  const config = SCRAPE_SOURCES[source] || SCRAPE_SOURCES.dribbble;
  const styles = [];
  
  try {
    await page.goto(config.url, { waitUntil: 'networkidle2' });
    await page.waitForSelector(config.selector, { timeout: 10000 });
    
    const elements = await page.$$(config.selector);
    const limited = elements.slice(0, count);
    
    for (const el of limited) {
      const style = await el.evaluate(node => {
        const styles = window.getComputedStyle(node);
        return {
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage,
          color: styles.color,
          fontFamily: styles.fontFamily,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow
        };
      });
      styles.push(style);
    }
    
    await browser.close();
    return styles;
  } catch (e) {
    console.error('Scraping error:', e.message);
    await browser.close();
    return styles;
  }
}

export function getSources() {
  return Object.keys(SCRAPE_SOURCES);
}