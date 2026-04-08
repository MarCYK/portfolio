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

const PAGES = [
  { name: 'projects', url: 'https://www.zchry.org/projects' },
  { name: 'words', url: 'https://www.zchry.org/words' },
  { name: 'about', url: 'https://www.zchry.org/about' },
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const extractScript = (selector) => `
    (function(selector) {
      const el = document.querySelector(selector);
      if (!el) return JSON.stringify({ error: 'not found: ' + selector });
      const props = ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color','textTransform','backgroundColor','background','padding','paddingTop','paddingRight','paddingBottom','paddingLeft','margin','marginTop','marginBottom','width','height','maxWidth','display','flexDirection','justifyContent','alignItems','gap','gridTemplateColumns','borderRadius','border','boxShadow','overflow','position','top','right','bottom','left','zIndex','opacity','transform','transition','cursor','objectFit','filter','backdropFilter'];
      function extractStyles(element) {
        const cs = getComputedStyle(element);
        const styles = {};
        props.forEach(p => { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') styles[p] = v; });
        return styles;
      }
      function walk(element, depth) {
        if (depth > 5) return null;
        const children = [...element.children];
        return {
          tag: element.tagName.toLowerCase(),
          classes: element.className?.toString().split(' ').slice(0, 10).join(' '),
          text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 ? element.textContent.trim().slice(0, 300) : null,
          styles: extractStyles(element),
          images: element.tagName === 'IMG' ? { src: element.src, alt: element.alt, w: element.naturalWidth, h: element.naturalHeight } : null,
          childCount: children.length,
          children: children.slice(0, 20).map(c => walk(c, depth + 1)).filter(Boolean)
        };
      }
      return JSON.stringify(walk(el, 0), null, 2);
    })('${selector}')
  `;

async function reconPage(page, pageName, url) {
  console.log(`\n=== Recon: ${pageName} (${url}) ===`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(2000);

  // Desktop full page screenshot
  await page.setViewportSize({ width: 1440, height: 900 });
  await sleep(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await page.screenshot({ path: path.join(DESIGN_REF, `${pageName}-desktop.png`), fullPage: true });

  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await sleep(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(DESIGN_REF, `${pageName}-mobile.png`), fullPage: true });

  // Back to desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await sleep(500);

  // Get full HTML
  const html = await page.content();
  fs.writeFileSync(path.join(RESEARCH, `page-${pageName}.html`), html);

  // Page data dump
  const dump = await page.evaluate(() => {
    return JSON.stringify({
      url: window.location.href,
      title: document.title,
      allText: document.body.innerText?.trim(),
      height: document.body.scrollHeight,
      allSections: [...document.querySelectorAll('section, main, article, aside, header, footer, nav, [class*="container"], [class*="wrapper"]')].map(el => ({
        tag: el.tagName,
        id: el.id,
        classes: el.className?.toString().slice(0, 200),
        height: el.getBoundingClientRect().height,
        offsetTop: Math.round(el.getBoundingClientRect().top + window.scrollY),
        innerText: el.innerText?.trim().slice(0, 400)
      })),
      images: [...document.querySelectorAll('img')].map(img => ({
        src: img.src,
        alt: img.alt,
        w: img.naturalWidth,
        h: img.naturalHeight,
        classes: img.className?.toString()
      })),
      links: [...document.querySelectorAll('a')].map(a => ({
        text: a.textContent?.trim().slice(0, 80),
        href: a.href,
        classes: a.className?.toString().slice(0, 80)
      })).filter(a => a.text || a.href),
      cssVars: (() => {
        try {
          const style = getComputedStyle(document.documentElement);
          const vars = {};
          for (let i = 0; i < style.length; i++) {
            const prop = style[i];
            if (prop.startsWith('--') && !prop.startsWith('--tw-')) vars[prop] = style.getPropertyValue(prop).trim();
          }
          return vars;
        } catch(e) { return {}; }
      })()
    });
  });
  fs.writeFileSync(path.join(RESEARCH, `dump-${pageName}.json`), dump);

  // Extract main content
  const mainData = await page.evaluate(extractScript('main'));
  fs.writeFileSync(path.join(RESEARCH, `section-main-${pageName}.json`), mainData);

  // Scroll capture
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`  Page height: ${pageHeight}`);

  if (pageHeight > 900) {
    const steps = [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200];
    for (const y of steps.filter(s => s < pageHeight)) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await sleep(500);
      const actualY = await page.evaluate(() => window.scrollY);
      await page.screenshot({ path: path.join(DESIGN_REF, `${pageName}-scroll-${actualY}.png`) });
    }
  }

  const dumpData = JSON.parse(dump);
  console.log(`  Text: ${dumpData.allText?.slice(0, 300)}`);
  console.log(`  Sections found: ${dumpData.allSections?.length}`);

  return dumpData;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {};
  for (const p of PAGES) {
    results[p.name] = await reconPage(page, p.name, p.url);
  }

  // Also revisit home page with more thorough extraction
  console.log('\n=== Deep recon: home page ===');
  await page.goto('https://www.zchry.org/', { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(2000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await sleep(500);

  // Extract the CSS from stylesheets
  const cssData = await page.evaluate(async () => {
    const sheets = [...document.styleSheets];
    const cssTexts = [];
    for (const sheet of sheets) {
      try {
        const rules = [...sheet.cssRules];
        const texts = rules.map(r => r.cssText).join('\n');
        cssTexts.push({ href: sheet.href, css: texts.slice(0, 50000) });
      } catch (e) {
        cssTexts.push({ href: sheet.href, error: e.message });
      }
    }
    return cssTexts;
  });
  fs.writeFileSync(path.join(RESEARCH, 'all-css-rules.json'), JSON.stringify(cssData, null, 2));
  console.log('CSS rules extracted.');

  // Extract header in detail
  const headerData = await page.evaluate(`
    (function() {
      const header = document.getElementById('site-header');
      if (!header) return 'not found';
      return {
        outerHTML: header.outerHTML.slice(0, 10000),
        computedBg: getComputedStyle(header).backgroundColor,
        computedH: header.getBoundingClientRect().height,
        navLinks: [...header.querySelectorAll('a')].map(a => ({
          text: a.textContent.trim(),
          href: a.href,
          classes: a.className
        })),
        buttons: [...header.querySelectorAll('button')].map(btn => ({
          id: btn.id,
          label: btn.getAttribute('aria-label'),
          classes: btn.className
        })),
        svgs: [...header.querySelectorAll('svg')].length
      };
    })()
  `);
  fs.writeFileSync(path.join(RESEARCH, 'header-detail.json'), JSON.stringify(headerData, null, 2));

  // Extract CSS variables in detail
  const cssVarsDetail = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const vars = {};
    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      if (prop.startsWith('--') && !prop.startsWith('--tw-')) {
        vars[prop] = style.getPropertyValue(prop).trim();
      }
    }
    return vars;
  });
  fs.writeFileSync(path.join(RESEARCH, 'css-vars-detail.json'), JSON.stringify(cssVarsDetail, null, 2));
  console.log('CSS vars extracted:', Object.keys(cssVarsDetail).length, 'variables');

  // Get all SVG elements from homepage
  const svgData = await page.evaluate(() => {
    return [...document.querySelectorAll('svg')].map((svg, i) => ({
      index: i,
      id: svg.id,
      class: svg.getAttribute('class'),
      viewBox: svg.getAttribute('viewBox'),
      outerHTML: svg.outerHTML.slice(0, 2000),
      parentClass: svg.parentElement?.className,
      parentId: svg.parentElement?.id
    }));
  });
  fs.writeFileSync(path.join(RESEARCH, 'svg-icons.json'), JSON.stringify(svgData, null, 2));
  console.log('SVG icons extracted:', svgData.length);

  // Screenshot at different hover states - check nav link hover
  await page.setViewportSize({ width: 1440, height: 900 });

  // Mobile menu test
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await page.setViewportSize({ width: 390, height: 844 });
  await sleep(500);
  await page.screenshot({ path: path.join(DESIGN_REF, 'home-mobile.png') });

  // Try clicking hamburger
  try {
    const hamburger = await page.$('#menu-toggle');
    if (hamburger) {
      await hamburger.click();
      await sleep(500);
      await page.screenshot({ path: path.join(DESIGN_REF, 'home-mobile-menu-open.png') });
      console.log('Mobile menu screenshot taken.');
    }
  } catch (e) {
    console.log('Could not click hamburger:', e.message);
  }

  await browser.close();
  console.log('\nAll page recon complete!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
