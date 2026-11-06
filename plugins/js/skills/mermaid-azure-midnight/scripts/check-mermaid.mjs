#!/usr/bin/env node
// Lints and layout-checks Mermaid blocks, and lints styled HTML tables, in Markdown (.md) or Mermaid (.mmd) files.
//
// Usage:
//   node check-mermaid.mjs <file...> [--target ado|web] [--versions 10,11] [--png <dir>] [--static]
//
//   --target ado   Azure DevOps wiki profile: also flags syntax the wiki does not support.
//   --target web   Default. GitHub, VS Code, mermaid.live, docs sites.
//   --versions     Mermaid versions to render with (default 11). Loaded from cdn.jsdelivr.net.
//                  For the Azure DevOps wiki use 10,11: it renders sequence box groups and line-2 settings,
//                  so it runs a Mermaid 10 release newer than 10.3 (the exact version is not published).
//   --png <dir>    Save a screenshot of each rendered block for visual review.
//   --static       Lint only; skip the browser render.
//
// Browser: uses Edge or Chrome already installed. Override with CHROME_PATH.
// Exit code 1 when any error is found; warnings do not fail the run.

import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : def; };
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? (args.splice(i, 1), true) : false; };
const target = opt('--target', 'web');
const versions = opt('--versions', '11').split(',').map(s => s.trim());
const pngDir = opt('--png', null);
const staticOnly = flag('--static');
const files = args;
if (!files.length) { console.error('Usage: node check-mermaid.mjs <file...> [--target ado|web] [--versions 10,11] [--png dir] [--static]'); process.exit(2); }

// Every colour in reference/theme.md. Anything else is off-palette.
const PALETTE = new Set(['#0b1a2e', '#1f3a5f', '#10243f', '#24476f', '#9cc3ea', '#e6f1ff', '#3ca0ff', '#0078d4', '#50e6ff',
  '#ffb900', '#6ccb5f', '#f1707b', '#0e2a4a', '#132c4c', '#6b8bb0', '#004a8f', '#ffffff', '#06323b', '#d6fbff',
  '#3a2c00', '#fff4ce', '#0f2e17', '#dff6dd', '#3b0f14', '#fde7e9', '#0d1726', '#3d5573',
  'rgb(11, 26, 46)', 'rgb(16, 36, 63)']);
const CLASSES = ['bpProcess', 'bpInfo', 'bpData', 'bpDecision', 'bpWarning', 'bpSuccess', 'bpError', 'bpUser', 'bpExternal', 'bpCode'];

// ---------- extract ----------
function blocks(file) {
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (file.endsWith('.mmd')) return [{ line: 1, src: text.trim() }];
  const out = [];
  const re = /^(```mermaid|::: ?mermaid)\s*\n([\s\S]*?)^(```|:::)\s*$/gm;
  for (let m; (m = re.exec(text));) out.push({ line: text.slice(0, m.index).split('\n').length, src: m[2].trim() });
  // Styled HTML tables outside code fences. Fenced content is blanked (line count kept) so examples are skipped.
  const unfenced = text.replace(/^(```|:::)[^\n]*\n[\s\S]*?^(```|:::)\s*$/gm, (m) => m.replace(/[^\n]/g, ' '));
  const tre = /^[ \t]*<table[\s>][\s\S]*?<\/table>/gm;
  for (let m; (m = tre.exec(unfenced));) out.push({ line: unfenced.slice(0, m.index).split('\n').length, src: text.slice(m.index, m.index + m[0].length), table: true });
  return out;
}

// ---------- table lint ----------
function lintTable(src) {
  const errors = [], warnings = [];
  // Code inside <pre> (code cards) is raw HTML-block content: its indentation and * or ` characters are code, not Markdown.
  const outsidePre = src.replace(/<pre\b[\s\S]*?<\/pre>/g, (m) => m.replace(/[^\n]/g, 'x'));
  const lines = outsidePre.split('\n');
  if (src.split('\n').some(l => !l.trim())) errors.push('blank line inside <table> - Markdown ends the HTML block there and shows the rest as text');
  if (lines.some(l => /^( {4,}|\t)/.test(l))) errors.push('line indented 4+ spaces - Markdown turns it into a code block; keep the HTML flush left');
  const text = src.replace(/<pre\b[\s\S]*?<\/pre>/g, ' ').replace(/<[^>]*>/g, ' ');
  if (/`[^`]+`|\*\*[^*]+\*\*/.test(text)) warnings.push('Markdown syntax inside cells is not processed - use <code> chips or <b>');
  if (/\p{Extended_Pictographic}/u.test(text)) errors.push('emoji found - use icons or colour instead');
  const colours = [...new Set([...src.replace(/%23([0-9a-f]{6})/gi, '#$1').matchAll(/#[0-9a-f]{6}\b/gi)].map(m => m[0].toLowerCase()))];
  const off = colours.filter(c => !PALETTE.has(c));
  if (off.length) warnings.push(`colours outside the Azure Midnight palette: ${off.join(', ')}`);
  const tableTag = src.match(/<table[^>]*>/)?.[0] ?? '';
  // The Azure DevOps wiki lays tables out as blocks as wide as the page and ignores inline display, so anything
  // painted on <table> itself (background, border) spills past the rows. Colour and frame belong on the cells.
  if (/(^|;|")\s*(background|border)(-color)?\s*:/i.test(tableTag)) warnings.push('background or border on <table> itself - the Azure DevOps wiki stretches it to the page width; paint the cells instead (see reference/tables.md)');
  if (!/<t[hd][^>]*background:\s*#(0b1a2e|10243f|0e2a4a)/i.test(src)) warnings.push('cells have no Azure Midnight background - styled tables are dark cards painted on their cells');
  if (/<th\b/.test(src) && !/border-bottom:\s*3px solid #3ca0ff/i.test(src)) warnings.push('header has no 3px #3ca0ff rule under it');
  if (!/<thead>/.test(src)) warnings.push('no <thead> - put header cells in <thead> so readers and screen readers see them as headers');
  return { kind: 'table', errors, warnings };
}

// ---------- static lint ----------
function lint(src) {
  const errors = [], warnings = [];
  const init = src.match(/%%\{\s*init:\s*([\s\S]*?)\}%%/);
  if (init) {
    let cfg;
    try { cfg = JSON.parse(init[1]); } catch (e) { errors.push(`init block is not valid JSON (use double quotes): ${e.message}`); }
    for (const [k, v] of Object.entries(cfg?.themeVariables ?? {})) {
      if (/[-']/.test(String(v))) errors.push(`themeVariables.${k} contains "-" or "'" - Mermaid silently ignores the whole init block. Value: ${v}`);
    }
  }
  const colours = [...src.replace(/%23([0-9a-f]{6})/gi, '#$1').matchAll(/#[0-9a-f]{6}\b|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/gi)]
    .map(m => m[0].toLowerCase().replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/, 'rgb($1, $2, $3)'));
  const offPalette = [...new Set(colours.filter(c => !PALETTE.has(c)))];
  if (offPalette.length) warnings.push(`colours outside the Azure Midnight palette: ${offPalette.join(', ')}`);
  if (/\p{Extended_Pictographic}/u.test(src.replace(/%%\{[\s\S]*?\}%%/, ''))) errors.push('emoji found - use icons or colour instead');
  const body = src.replace(/%%\{[\s\S]*?\}%%/, '');
  const kind = body.trim().split(/\s/)[0];
  for (const m of src.matchAll(/^\s*classDef\s+(\S+)/gm)) if (!CLASSES.includes(m[1])) warnings.push(`classDef "${m[1]}" is not a standard class (${CLASSES.join(', ')})`);
  if (/^\s*classDef\s+\S+\s+[^\n]*font-family/m.test(src)) errors.push('font-family in classDef: commas split the stack. Use themeCSS with the bpCode class');

  if (['graph', 'flowchart'].includes(kind)) {
    const subgraphs = [...src.matchAll(/^\s*subgraph\s+([A-Za-z0-9_]+)/gm)].map(m => m[1]);
    const edgeLines = src.split('\n').filter(l => /(-->|-\.->|==>|---|~~~)/.test(l));
    for (const sg of subgraphs) {
      if (edgeLines.some(l => new RegExp(`(^|\\s|&)${sg}(\\s|$|&)`).test(l.replace(/\|[^|]*\|/g, ' ')))) {
        (target === 'ado' ? errors : warnings).push(`edge to or from subgraph "${sg}" - link nodes instead (Azure DevOps rejects it)`);
      }
    }
    const firstSub = src.match(/^\s*subgraph\s+[^\n]+\n(\s*)([^\n]*)/m);
    if (firstSub && !/direction\s+(TB|TD|LR|RL|BT)/.test(firstSub[2])) warnings.push('outer subgraph has no "direction" line - Mermaid may flip it sideways');
    if (/[A-Za-z0-9_]\{"[^"]*"\}/.test(body.replace(/\{\{"[^"]*"\}\}/g, ''))) warnings.push('diamond node found - prefer hexagon {{"..."}} for gates; diamonds grow large with text');
  }
  if (target === 'ado') {
    if (kind === 'flowchart') errors.push('Azure DevOps wiki: use "graph", not "flowchart"');
    if (/@\{/.test(src)) errors.push('Azure DevOps wiki: @{ } node syntax is not supported');
    if (/\bfa:fa-/.test(src)) errors.push('Azure DevOps wiki: FontAwesome icons are not supported');
    if (/---->/.test(src)) errors.push('Azure DevOps wiki: long arrows (---->) are not supported');
    // Verified on the wiki: anything before the diagram keyword (a %%{init}%% line, a %% comment, --- front matter)
    // gives "Unsupported diagram type." The settings line works as the second line. scripts/to-ado.mjs moves it.
    const firstLine = src.split('\n').find(l => l.trim())?.trim() ?? '';
    if (!/^[A-Za-z]/.test(firstLine) || /^%%/.test(firstLine)) {
      errors.push('Azure DevOps wiki: the first line must be the diagram keyword (graph, sequenceDiagram, ...); move the %%{init}%% line below it (scripts/to-ado.mjs does it)');
    }
  } else if (/@\{\s*(icon|img):/.test(src)) {
    warnings.push('@{ icon: } / @{ img: } nodes: icon packs are not registered in Markdown renderers, and img nodes break the dark theme. Use inline <img> in labels');
  }
  return { kind, errors, warnings };
}

// ---------- browser ----------
function browserPath() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
  ].filter(Boolean);
  return candidates.find(p => existsSync(p));
}

// Runs inside the page. Mirrors the checks used to approve the standard.
const pageCheck = () => {
  const segInt = (a, b, c, d) => { const o = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x); return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };
  const inside = (p, r, m = 0) => p.x > r.left - m && p.x < r.right + m && p.y > r.top - m && p.y < r.bottom + m;
  const svg = document.querySelector('#out svg');
  const name = (n) => (n.querySelector('.nodeLabel')?.textContent || n.id).trim();
  const nodes = [...svg.querySelectorAll('g.node')].map(n => ({ n: name(n), r: n.getBoundingClientRect() }));
  const issues = [];
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    const a = nodes[i].r, b = nodes[j].r;
    if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) issues.push(`boxes overlap: "${nodes[i].n}" and "${nodes[j].n}"`);
  }
  const paths = [...svg.querySelectorAll('.edgePaths path, path.flowchart-link')];
  const pts = [...new Set(paths)].map(p => { const L = p.getTotalLength(), m = p.getScreenCTM(), a = []; for (let k = 0; k <= 60; k++) { const q = p.getPointAtLength(L * k / 60); a.push({ x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f }); } return a; });
  let crossings = 0;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    let hit = false;
    for (let k = 0; k < 60 && !hit; k++) for (let l = 0; l < 60 && !hit; l++) if (segInt(pts[i][k], pts[i][k + 1], pts[j][l], pts[j][l + 1])) hit = true;
    if (hit) crossings++;
  }
  if (crossings) issues.push(`${crossings} pair(s) of connectors cross`);
  // Skip the boxes a connector starts or ends in; curved shapes (cylinders) let the end sit inside the bounding box.
  pts.forEach(a => nodes.forEach(n => {
    if (inside(a[0], n.r, 8) || inside(a[a.length - 1], n.r, 8)) return;
    if (a.slice(4, -4).some(p => inside(p, n.r, -2))) issues.push(`a connector runs through box "${n.n}"`);
  }));
  const titles = [...svg.querySelectorAll('.cluster-label .nodeLabel')].filter(t => t.textContent.trim()).map(t => ({ t: t.textContent.trim(), r: t.getBoundingClientRect() }));
  titles.forEach(t => { if (pts.some(a => a.some(p => inside(p, t.r, 3)))) issues.push(`a connector runs through title "${t.t}"`); });
  svg.querySelectorAll('g.node').forEach(n => {
    const l = n.querySelector('.nodeLabel'), s = n.querySelector('rect,path,polygon');
    if (l && s && l.getBoundingClientRect().width > s.getBoundingClientRect().width - 8) issues.push(`text does not fit box "${name(n)}"`);
  });
  const warnings = [];
  const broken = [...svg.querySelectorAll('img')].filter(i => !i.naturalWidth).length;
  if (broken) warnings.push(`${broken} icon(s) did not load (offline or wrong name)`);
  // A label may hold deliberate <br> line breaks; only flag lines the renderer added.
  const lineHeight = (l) => parseFloat(getComputedStyle(l).lineHeight) || parseFloat(getComputedStyle(l).fontSize) * 1.5;
  const wrapped = [...svg.querySelectorAll('g.node .nodeLabel')]
    .filter(l => l.getBoundingClientRect().height > (l.querySelectorAll('br').length + 1) * lineHeight(l) + 6)
    .map(l => l.textContent.trim());
  if (wrapped.length) warnings.push(`label wraps onto two lines: ${wrapped.map(w => `"${w}"`).join(', ')}`);
  const vb = svg.viewBox.baseVal;
  return { issues, warnings, size: `${Math.round(vb.width)}x${Math.round(vb.height)}` };
};

async function render(items) {
  const exe = browserPath();
  if (!exe) throw new Error('No Edge or Chrome found. Set CHROME_PATH or run with --static.');
  const { default: puppeteer } = await import('puppeteer-core');
  const browser = await puppeteer.launch({ executablePath: exe, headless: true });
  try {
    for (const v of versions) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1400, height: 1000 });
      await page.setContent(`<!doctype html><meta charset="utf-8">
<script src="https://cdn.jsdelivr.net/npm/mermaid@${v}/dist/mermaid.min.js"></script>
<body style="margin:0;background:#ffffff"><div id="out" style="display:inline-block;padding:16px"></div></body>`, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.evaluate(async () => {
        // The standard fonts are Windows 11 system fonts (Segoe UI Variable, Cascadia Code); load them before measuring.
        await Promise.all(['15px "Segoe UI Variable Text"', '600 15px "Segoe UI Variable Text"', '15px "Cascadia Code"'].map(f => document.fonts.load(f).catch(() => {})));
        window.mermaid.initialize({ startOnLoad: false });
      });
      const actual = await page.evaluate(() => window.mermaid?.version?.() ?? '');
      for (const it of items) {
        if (it.kind === 'table') continue; // tables are linted statically
        const res = await page.evaluate(async (src, id) => {
          const out = document.getElementById('out');
          try {
            // Mermaid 10+ returns a promise of { svg }; 8.x and 9.x want a container and return the SVG string.
            let result;
            try { result = await window.mermaid.render(id, src); }
            catch (e) { if (!/createElementNS|reading 'append'/.test(String(e.message))) throw e; result = window.mermaid.render(id, src, () => {}, out); }
            const svg = typeof result === 'string' ? result : result.svg;
            if (/Syntax error in/.test(svg)) throw new Error('Syntax error in diagram');
            out.innerHTML = svg;
            // Show at natural size so measurements are in real pixels.
            const el = out.querySelector('svg'), vb = el.viewBox.baseVal;
            if (vb && vb.width) { el.style.maxWidth = 'none'; el.style.width = `${vb.width}px`; el.style.height = `${vb.height}px`; }
          }
          catch (e) { return { error: String(e.message || e).split('\n')[0] }; }
          await Promise.all([...out.querySelectorAll('img')].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 8000); })));
          return { ok: true };
        }, it.src, `m${Math.random().toString(36).slice(2)}`);
        const key = `mermaid ${actual || v}`;
        if (res.error) { it.errors.push(`${key}: render failed - ${res.error}`); continue; }
        if (!['graph', 'flowchart'].includes(it.kind)) { it.info.push(`${key}: rendered (layout checks apply to flowcharts only)`); }
        else {
          const r = await page.evaluate(pageCheck);
          r.issues.forEach(x => it.errors.push(`${key}: ${x}`));
          r.warnings.forEach(x => it.warnings.push(`${key}: ${x}`));
          it.info.push(`${key}: rendered ${r.size}`);
        }
        if (pngDir) {
          mkdirSync(pngDir, { recursive: true });
          const el = await page.$('#out');
          const file = join(pngDir, `${basename(it.file).replace(/\.\w+$/, '')}-L${it.line}-v${v}.png`);
          await el.screenshot({ path: file });
          it.info.push(`screenshot ${file}`);
        }
      }
      await page.close();
    }
  } finally { await browser.close(); }
}

// ---------- main ----------
const items = [];
for (const f of files) {
  const found = blocks(resolve(f));
  if (!found.length) console.warn(`${f}: no mermaid blocks or tables`);
  for (const b of found) { const l = b.table ? lintTable(b.src) : lint(b.src); items.push({ file: f, line: b.line, src: b.src, kind: l.kind, errors: l.errors, warnings: l.warnings, info: [] }); }
}
if (!staticOnly && items.some(i => i.kind !== 'table')) {
  try { await render(items); }
  catch (e) { console.error(`render skipped: ${e.message}`); process.exitCode = 1; }
}
let failed = 0;
for (const it of items) {
  const status = it.errors.length ? 'FAIL' : 'PASS';
  if (it.errors.length) failed++;
  console.log(`${status}  ${it.file}:${it.line}  (${it.kind}, target ${target})`);
  it.errors.forEach(e => console.log(`   error    ${e}`));
  it.warnings.forEach(w => console.log(`   warning  ${w}`));
  it.info.forEach(i => console.log(`   info     ${i}`));
}
console.log(`\n${items.length - failed}/${items.length} blocks passed.`);
if (failed) process.exitCode = 1;
