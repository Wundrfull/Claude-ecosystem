#!/usr/bin/env node
/**
 * Screenshot every slide in the deck at 1920x1080. Also capture:
 *   - total slide count (from footer "N / total")
 *   - any console errors / warnings
 *   - whether the slide content overflows its 100vh viewport
 *   - whether any text gets cut off at the padding edges
 *
 * Outputs:
 *   slides/screenshots/slide-NN.png  — one png per slide
 *   slides/screenshots/report.json   — per-slide diagnostics
 *   slides/screenshots/report.md     — readable summary
 *
 * Usage: node shoot.js [port]   (defaults to 8765 to avoid collision)
 */

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2] || '8765', 10);
const ROOT = path.resolve(__dirname);
const OUT = path.join(ROOT, 'screenshots');
const WIDTH = 1920;
const HEIGHT = 1080;

// Mini static server with no-cache headers so each reload picks up latest.
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      // Serve files relative to ROOT.
      let filePath = path.join(ROOT, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
      // Prevent path traversal.
      if (!filePath.startsWith(ROOT) && !filePath.startsWith(path.dirname(ROOT))) {
        res.writeHead(403); res.end(); return;
      }
      // Allow fetch of brand-assets from parent dir (it's a sibling).
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404); res.end(`not found: ${req.url}`); return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME[ext] || 'application/octet-stream',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
    server.on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  console.log(`starting server on :${PORT}...`);
  const server = await startServer();

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });

  const consoleIssues = [];
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      consoleIssues.push({ type, text: msg.text() });
    }
  });
  page.on('pageerror', err => {
    consoleIssues.push({ type: 'pageerror', text: err.message });
  });

  console.log('loading deck...');
  await page.goto(`http://localhost:${PORT}/?v=${Date.now()}`, { waitUntil: 'networkidle' });

  // Wait for slides to finish loading (deck.js fetches sections async).
  await page.waitForSelector('.slide[data-index]', { timeout: 10000 });
  // Give fonts + CSS animations a moment to settle.
  await page.waitForTimeout(800);

  const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log(`found ${total} slides; capturing...`);

  const report = { total, slides: [] };

  for (let i = 0; i < total; i++) {
    // Navigate to slide i.
    await page.evaluate((idx) => {
      if (typeof goTo === 'function') goTo(idx);
    }, i);
    // Let animations reach steady-state (typing ~2s, output ~3s, benefits ~4s).
    await page.waitForTimeout(4500);

    // Capture diagnostics per slide.
    const diag = await page.evaluate(() => {
      const slide = document.querySelector('.slide.active');
      if (!slide) return { err: 'no active slide' };
      const section = slide.dataset.section || '';
      const r = slide.getBoundingClientRect();
      // Check if slide's scrollHeight exceeds its offsetHeight (overflow).
      const overflowY = slide.scrollHeight > slide.offsetHeight + 2;
      const overflowX = slide.scrollWidth > slide.offsetWidth + 2;
      // Sample text at padding edges to detect cutoff: look at any child
      // element whose bounding box extends past the slide's content box.
      const pad = { top: 0.06 * slide.offsetHeight, side: 0.08 * slide.offsetWidth };
      const slideBox = slide.getBoundingClientRect();
      const contentBox = {
        left: slideBox.left + pad.side,
        right: slideBox.right - pad.side,
        top: slideBox.top + pad.top,
        bottom: slideBox.bottom - pad.top,
      };
      const clippedEls = [];
      slide.querySelectorAll('h1, h2, h3, p, li, pre, .term, .ctx-real, .tree, .graph').forEach(el => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) return;
        if (b.bottom > contentBox.bottom + 2) clippedEls.push({ tag: el.tagName, cls: el.className.slice(0, 80), kind: 'bottom-cut' });
        if (b.right  > contentBox.right + 2)  clippedEls.push({ tag: el.tagName, cls: el.className.slice(0, 80), kind: 'right-cut' });
      });
      return { section, overflowY, overflowX, clippedEls, w: slide.offsetWidth, h: slide.offsetHeight };
    });

    const filename = `slide-${String(i + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: path.join(OUT, filename), fullPage: false });

    report.slides.push({ index: i + 1, file: filename, ...diag });
    if (diag.overflowY || diag.overflowX || (diag.clippedEls || []).length > 0) {
      console.log(`  slide ${i + 1} [${diag.section}] -- issues:`,
        diag.overflowY ? 'overflowY' : '',
        diag.overflowX ? 'overflowX' : '',
        `${(diag.clippedEls || []).length} clipped`);
    } else {
      console.log(`  slide ${i + 1} [${diag.section}] -- clean`);
    }
  }

  report.consoleIssues = consoleIssues;

  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

  // Human-readable markdown summary.
  const lines = [];
  lines.push(`# Deck screenshot report`);
  lines.push(``);
  lines.push(`- Total slides: **${total}**`);
  lines.push(`- Viewport: ${WIDTH}×${HEIGHT}`);
  lines.push(`- Console issues: ${consoleIssues.length}`);
  lines.push(``);
  lines.push(`## Per-slide diagnostics`);
  lines.push(``);
  lines.push(`| # | Section | Overflow Y | Overflow X | Clipped els | PNG |`);
  lines.push(`|---|---------|------------|------------|-------------|-----|`);
  for (const s of report.slides) {
    const clip = (s.clippedEls || []).length;
    lines.push(`| ${s.index} | ${s.section || '(?)'} | ${s.overflowY ? 'YES' : ''} | ${s.overflowX ? 'YES' : ''} | ${clip > 0 ? clip : ''} | [${s.file}](${s.file}) |`);
  }
  if (consoleIssues.length) {
    lines.push(``);
    lines.push(`## Console issues`);
    for (const c of consoleIssues) lines.push(`- **${c.type}**: ${c.text}`);
  }
  // Also dump a detailed section of clipped elements per slide, to help
  // the fix pass know where to look.
  const withClips = report.slides.filter(s => (s.clippedEls || []).length > 0);
  if (withClips.length) {
    lines.push(``);
    lines.push(`## Clipped elements (per slide)`);
    for (const s of withClips) {
      lines.push(`### Slide ${s.index}: ${s.section}`);
      for (const c of s.clippedEls.slice(0, 15)) {
        lines.push(`- ${c.kind} — ${c.tag}.${c.cls}`);
      }
      if (s.clippedEls.length > 15) lines.push(`- ...and ${s.clippedEls.length - 15} more`);
    }
  }
  fs.writeFileSync(path.join(OUT, 'report.md'), lines.join('\n'));
  console.log(`report written to ${OUT}/report.md`);

  await browser.close();
  server.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
