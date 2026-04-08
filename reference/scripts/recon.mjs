import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DESIGN_REF = path.join(ROOT, 'docs', 'design-references');
const RESEARCH = path.join(ROOT, 'docs', 'research');

fs.mkdirSync(DESIGN_REF, { recursive: true });
fs.mkdirSync(RESEARCH, { recursive: true });

const TARGET_URL = 'https://www.zchry.org/';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to', TARGET_URL);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(2000);

  // ===== DESKTOP SCREENSHOT =====
  console.log('Taking desktop screenshot (1440px)...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await sleep(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await page.screenshot({
    path: path.join(DESIGN_REF, 'desktop-full.png'),
    fullPage: true
  });
  console.log('Desktop screenshot saved.');

  // ===== TABLET SCREENSHOT =====
  console.log('Taking tablet screenshot (768px)...');
  await page.setViewportSize({ width: 768, height: 1024 });
  await sleep(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await page.screenshot({
    path: path.join(DESIGN_REF, 'tablet-full.png'),
    fullPage: true
  });
  console.log('Tablet screenshot saved.');

  // ===== MOBILE SCREENSHOT =====
  console.log('Taking mobile screenshot (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await sleep(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await page.screenshot({
    path: path.join(DESIGN_REF, 'mobile-full.png'),
    fullPage: true
  });
  console.log('Mobile screenshot saved.');

  // ===== Back to desktop for data extraction =====
  await page.setViewportSize({ width: 1440, height: 900 });
  await sleep(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);

  // ===== EXTRACT GLOBAL TOKENS =====
  console.log('Extracting global tokens...');
  const globalTokens = await page.evaluate(() => {
    return JSON.stringify({
      fonts: [...new Set([...document.querySelectorAll('*')].slice(0, 300).map(el => getComputedStyle(el).fontFamily))].slice(0, 20),
      fontLinks: [...document.querySelectorAll('link[rel="stylesheet"], style')].map(l => l.href || l.textContent?.slice(0, 200)),
      headingFont: getComputedStyle(document.querySelector('h1, h2, h3') || document.body).fontFamily,
      bodyFont: getComputedStyle(document.body).fontFamily,
      bgColor: getComputedStyle(document.body).backgroundColor,
      textColor: getComputedStyle(document.body).color,
      images: [...document.querySelectorAll('img')].map(img => ({
        src: img.src || img.currentSrc,
        alt: img.alt,
        width: img.naturalWidth,
        height: img.naturalHeight,
        parentClasses: img.parentElement?.className,
        position: getComputedStyle(img).position,
        zIndex: getComputedStyle(img).zIndex
      })),
      videos: [...document.querySelectorAll('video')].map(v => ({
        src: v.src || v.querySelector?.('source')?.src,
        poster: v.poster
      })),
      backgroundImages: [...document.querySelectorAll('*')].filter(el => {
        const bg = getComputedStyle(el).backgroundImage;
        return bg && bg !== 'none';
      }).map(el => ({
        url: getComputedStyle(el).backgroundImage,
        element: el.tagName + (el.className ? '.' + el.className.toString().split(' ')[0] : '')
      })).slice(0, 30),
      svgCount: document.querySelectorAll('svg').length,
      favicons: [...document.querySelectorAll('link[rel*="icon"]')].map(l => ({ href: l.href, sizes: l.sizes?.toString() })),
      metaOg: [...document.querySelectorAll('meta[property^="og:"]')].map(m => ({ property: m.getAttribute('property'), content: m.content })),
      title: document.title,
      colorVars: [...document.styleSheets].flatMap(ss => { try { return [...ss.cssRules]; } catch(e) { return []; } }).filter(r => r.selectorText === ':root').map(r => r.cssText).join('\n').slice(0, 3000),
      smoothScroll: document.querySelector('.lenis, [data-lenis], [data-locomotive]') ? 'found' : 'not found',
      scrollBehavior: document.documentElement.style.scrollBehavior,
      allLinks: [...document.querySelectorAll('a[href]')].slice(0, 50).map(a => ({ text: a.textContent.trim().slice(0, 60), href: a.href }))
    });
  });
  fs.writeFileSync(path.join(RESEARCH, 'global-tokens-raw.json'), globalTokens);
  console.log('Global tokens extracted.');

  // ===== PAGE STRUCTURE =====
  console.log('Extracting page structure...');
  const pageStructure = await page.evaluate(() => {
    return JSON.stringify([...document.querySelectorAll('body > *, header, nav, main, section, footer, [class*="section"], [class*="hero"], [class*="nav"]')].slice(0, 40).map(el => ({
      tag: el.tagName,
      id: el.id,
      classes: el.className?.toString().slice(0, 100),
      children: el.children.length,
      text: el.textContent?.trim().slice(0, 150),
      height: el.getBoundingClientRect().height,
      offsetTop: el.getBoundingClientRect().top + window.scrollY
    })));
  });
  fs.writeFileSync(path.join(RESEARCH, 'page-structure-raw.json'), pageStructure);
  console.log('Page structure extracted.');

  // ===== SCROLL BEHAVIOR SWEEP =====
  console.log('Performing scroll sweep...');
  const scrollData = {};

  // At y=0
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  await page.screenshot({ path: path.join(DESIGN_REF, 'scroll-y0.png') });
  scrollData['y0'] = await page.evaluate(() => {
    const nav = document.querySelector('header, nav, [class*="nav"], [class*="header"]');
    return nav ? {
      classes: nav.className?.toString(),
      bg: getComputedStyle(nav).backgroundColor,
      height: nav.getBoundingClientRect().height,
      position: getComputedStyle(nav).position
    } : null;
  });

  // At y=100
  await page.evaluate(() => window.scrollTo(0, 100));
  await sleep(800);
  await page.screenshot({ path: path.join(DESIGN_REF, 'scroll-y100.png') });
  scrollData['y100'] = await page.evaluate(() => {
    const nav = document.querySelector('header, nav, [class*="nav"], [class*="header"]');
    return nav ? {
      classes: nav.className?.toString(),
      bg: getComputedStyle(nav).backgroundColor,
      height: nav.getBoundingClientRect().height,
      position: getComputedStyle(nav).position
    } : null;
  });

  // At y=300
  await page.evaluate(() => window.scrollTo(0, 300));
  await sleep(800);
  await page.screenshot({ path: path.join(DESIGN_REF, 'scroll-y300.png') });

  // At y=600
  await page.evaluate(() => window.scrollTo(0, 600));
  await sleep(800);
  await page.screenshot({ path: path.join(DESIGN_REF, 'scroll-y600.png') });

  // At y=1000
  await page.evaluate(() => window.scrollTo(0, 1000));
  await sleep(800);
  await page.screenshot({ path: path.join(DESIGN_REF, 'scroll-y1000.png') });

  // At bottom
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((h) => window.scrollTo(0, h), pageHeight);
  await sleep(800);
  await page.screenshot({ path: path.join(DESIGN_REF, 'scroll-bottom.png') });

  scrollData['pageHeight'] = pageHeight;
  fs.writeFileSync(path.join(RESEARCH, 'scroll-data-raw.json'), JSON.stringify(scrollData, null, 2));
  console.log('Scroll sweep done. Page height:', pageHeight);

  // ===== EXTRACT FULL PAGE HTML =====
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  const html = await page.content();
  fs.writeFileSync(path.join(RESEARCH, 'page-html.html'), html);
  console.log('HTML saved.');

  // ===== SECTION-BY-SECTION CSS EXTRACTION =====
  console.log('Extracting section styles...');

  const extractScript = (selector) => `
    (function(selector) {
      const el = document.querySelector(selector);
      if (!el) return JSON.stringify({ error: 'not found: ' + selector });
      const props = ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color','textTransform','backgroundColor','background','padding','paddingTop','paddingRight','paddingBottom','paddingLeft','margin','width','height','maxWidth','display','flexDirection','justifyContent','alignItems','gap','gridTemplateColumns','borderRadius','border','boxShadow','overflow','position','top','right','bottom','left','zIndex','opacity','transform','transition','cursor'];
      function extractStyles(element) {
        const cs = getComputedStyle(element);
        const styles = {};
        props.forEach(p => { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') styles[p] = v; });
        return styles;
      }
      function walk(element, depth) {
        if (depth > 4) return null;
        const children = [...element.children];
        return {
          tag: element.tagName.toLowerCase(),
          classes: element.className?.toString().split(' ').slice(0, 8).join(' '),
          text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 ? element.textContent.trim().slice(0, 300) : null,
          styles: extractStyles(element),
          images: element.tagName === 'IMG' ? { src: element.src, alt: element.alt } : null,
          childCount: children.length,
          children: children.slice(0, 15).map(c => walk(c, depth + 1)).filter(Boolean)
        };
      }
      return JSON.stringify(walk(el, 0), null, 2);
    })('${selector}')
  `;

  // Extract nav/header
  const navData = await page.evaluate(extractScript('header'));
  fs.writeFileSync(path.join(RESEARCH, 'section-nav.json'), navData);

  // Extract all direct children of body to find sections
  const bodySections = await page.evaluate(() => {
    const children = [...document.body.children];
    return children.map((el, i) => ({
      index: i,
      tag: el.tagName,
      id: el.id,
      classes: el.className?.toString().slice(0, 150),
      height: el.getBoundingClientRect().height,
      offsetTop: el.getBoundingClientRect().top + window.scrollY,
      text: el.textContent?.trim().slice(0, 200)
    }));
  });
  fs.writeFileSync(path.join(RESEARCH, 'body-sections-raw.json'), JSON.stringify(bodySections, null, 2));

  // Try common section selectors
  const sectionSelectors = ['main', 'footer', '#hero', '.hero', '[class*="hero"]', 'section:first-of-type', 'section:nth-of-type(2)', 'section:nth-of-type(3)', 'section:nth-of-type(4)', 'section:nth-of-type(5)'];
  const sectionData = {};
  for (const sel of sectionSelectors) {
    try {
      const data = await page.evaluate(extractScript(sel));
      if (!data.includes('"error"')) {
        sectionData[sel] = JSON.parse(data);
      }
    } catch(e) {}
  }
  fs.writeFileSync(path.join(RESEARCH, 'sections-data.json'), JSON.stringify(sectionData, null, 2));

  // ===== EXTRA: hover states and interactions =====
  console.log('Checking for interactive elements...');
  const interactiveElements = await page.evaluate(() => {
    const clickable = [...document.querySelectorAll('a, button, [role="button"], input, [onclick]')];
    return clickable.slice(0, 30).map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim().slice(0, 80),
      href: el.href || null,
      classes: el.className?.toString().slice(0, 100),
      type: el.type || null
    }));
  });
  fs.writeFileSync(path.join(RESEARCH, 'interactive-elements.json'), JSON.stringify(interactiveElements, null, 2));

  // ===== NAV LINKS CLICK TRACKING =====
  console.log('Mapping navigation links...');
  const navLinks = await page.evaluate(() => {
    const links = [...document.querySelectorAll('nav a, header a, [class*="nav"] a')];
    return links.map(a => ({
      text: a.textContent?.trim(),
      href: a.href,
      classes: a.className?.toString()
    }));
  });
  fs.writeFileSync(path.join(RESEARCH, 'nav-links.json'), JSON.stringify(navLinks, null, 2));

  // ===== COMPUTE ALL UNIQUE COLORS =====
  console.log('Extracting all color values...');
  const colorData = await page.evaluate(() => {
    const colorProps = ['color', 'backgroundColor', 'borderColor', 'outlineColor'];
    const colorSet = new Set();
    [...document.querySelectorAll('*')].slice(0, 500).forEach(el => {
      const cs = getComputedStyle(el);
      colorProps.forEach(p => {
        const v = cs[p];
        if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') colorSet.add(v);
      });
    });
    return [...colorSet];
  });
  fs.writeFileSync(path.join(RESEARCH, 'colors-raw.json'), JSON.stringify(colorData, null, 2));

  // ===== FULL SECTION SCREENSHOTS at desktop =====
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);

  // screenshot at various scroll positions
  const steps = [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400];
  for (const y of steps) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await sleep(600);
    const actualY = await page.evaluate(() => window.scrollY);
    await page.screenshot({ path: path.join(DESIGN_REF, `section-at-${actualY}.png`) });
  }

  // ===== DETAILED FULL PAGE DATA DUMP =====
  const fullDump = await page.evaluate(() => {
    const result = {
      url: window.location.href,
      title: document.title,
      allText: document.body.innerText?.trim(),
      metaTags: [...document.querySelectorAll('meta')].map(m => ({ name: m.name, property: m.getAttribute('property'), content: m.content })),
      allSections: [...document.querySelectorAll('section, main, article, aside, header, footer, nav')].map(el => ({
        tag: el.tagName,
        id: el.id,
        classes: el.className?.toString().slice(0, 200),
        height: el.getBoundingClientRect().height,
        offsetTop: Math.round(el.getBoundingClientRect().top + window.scrollY),
        innerText: el.innerText?.trim().slice(0, 500)
      })),
      cssVarsDump: (() => {
        try {
          const style = getComputedStyle(document.documentElement);
          const vars = {};
          for (let i = 0; i < style.length; i++) {
            const prop = style[i];
            if (prop.startsWith('--')) vars[prop] = style.getPropertyValue(prop).trim();
          }
          return vars;
        } catch(e) { return {}; }
      })(),
      allFontFamilies: [...new Set([...document.querySelectorAll('*')].slice(0, 800).map(el => getComputedStyle(el).fontFamily))],
      googleFontsLinks: [...document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]')].map(l => l.href),
      allStylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href),
      inlineStyles: [...document.querySelectorAll('[style]')].slice(0, 20).map(el => ({
        tag: el.tagName,
        style: el.getAttribute('style'),
        classes: el.className?.toString().slice(0, 80)
      })),
    };
    return JSON.stringify(result);
  });
  fs.writeFileSync(path.join(RESEARCH, 'full-dump.json'), fullDump);

  await browser.close();
  console.log('All reconnaissance complete!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
