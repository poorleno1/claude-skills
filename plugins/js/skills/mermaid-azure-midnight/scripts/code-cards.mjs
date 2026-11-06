#!/usr/bin/env node
// Turns fenced code blocks in a Markdown file into Azure Midnight code cards: a navy header band with the language
// name and a 3px blue rule, code in Cascadia Code, syntax colours from the palette.
//
// Usage:
//   node code-cards.mjs <in.md> [out.md]      (writes to stdout when out.md is omitted)
//
// ```mermaid fences and ::: blocks are left alone. Cards are HTML tables painted on their cells only, 1040px wide,
// the layout that renders cleanly on the Azure DevOps wiki (see reference/tables.md).
//
// Colours: commands and functions #3ca0ff, variables and keys #50e6ff, parameters #9cc3ea, strings #ffb900,
// literals #3ca0ff, comments and punctuation #6b8bb0. Languages: yaml, json, powershell (ps1, pwsh), bash (sh, shell),
// hcl (terraform, tf); anything else is shown uncoloured.

import { readFileSync, writeFileSync } from 'node:fs';

const C = { canvas: '#0b1a2e', band: '#0e2a4a', frame: '#1f3a5f', title: '#9cc3ea', text: '#e6f1ff',
  blue: '#3ca0ff', cyan: '#50e6ff', amber: '#ffb900', muted: '#6b8bb0' };
const WORDS = "'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif";
const CODE = "'Cascadia Code','Cascadia Mono',Consolas,monospace";
const WIDTH = 1040;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (color, t, italic = false) => `<span style="color:${color}${italic ? ';font-style:italic' : ''}">${esc(t)}</span>`;
const paint = {
  comment: (t) => span(C.muted, t, true),
  command: (t) => span(C.blue, t),
  flag: (t) => span(C.title, t),
  variable: (t) => span(C.cyan, t),
  key: (t) => span(C.cyan, t),
  string: (t) => span(C.amber, t),
  literal: (t) => span(C.blue, t),
  punct: (t) => span(C.muted, t),
};

const SHELL_COMMANDS = 'az|helm|oras|kubectl|docker|git|terraform|npm|npx|node|pwsh|curl|cd|export|echo';
const RULES = {
  yaml: [
    [/#.*$/, 'comment'],
    [/"(?:[^"\\]|\\.)*"|'[^']*'/, 'string'],
    [/^(\s*-?\s*)[\w.-]+(?=:(\s|$))/, 'key'],
    [/\b(and|in|or|not|eq|ne|succeeded|failed|always)(?=\()/, 'command'],
    [/\b(true|false|none|null)\b/, 'literal'],
    [/[|>](?=\s*$)|[[\]{}(),:]/, 'punct'],
  ],
  json: [
    [/"(?:[^"\\]|\\.)*"(?=\s*:)/, 'key'],
    [/"(?:[^"\\]|\\.)*"/, 'string'],
    [/\b(true|false|null)\b|-?\b\d+(\.\d+)?\b/, 'literal'],
    [/[[\]{}:,]/, 'punct'],
  ],
  powershell: [
    [/#.*$/, 'comment'],
    [/"(?:[^"`]|`.)*"|'[^']*'/, 'string'],
    [/\$\{?\w+\}?/, 'variable'],
    [/(?<=\s|^)--?[A-Za-z][\w-]*/, 'flag'],
    [new RegExp(`^(\\s*)(${SHELL_COMMANDS}|[A-Z][a-z]+-[A-Z]\\w+)(\\s+[a-z][\\w-]*){0,2}`), 'command'],
    [/`\s*$/, 'punct'],
  ],
  bash: [
    [/#.*$/, 'comment'],
    [/"(?:[^"\\]|\\.)*"|'[^']*'/, 'string'],
    [/\$\{?\w+\}?/, 'variable'],
    [/(?<=\s|^)--?[A-Za-z][\w-]*/, 'flag'],
    [new RegExp(`^(\\s*)(${SHELL_COMMANDS})(\\s+[a-z][\\w-]*){0,2}`), 'command'],
    [/\\\s*$/, 'punct'],
  ],
  hcl: [
    [/#.*$|\/\/.*$/, 'comment'],
    [/"(?:[^"\\]|\\.)*"/, 'string'],
    [/^(\s*)(resource|data|variable|output|module|provider|terraform|locals)\b/, 'command'],
    [/^(\s*)[\w-]+(?=\s*=)/, 'key'],
    [/\b(var|local|module|data)\.[\w.-]+/, 'variable'],
    [/\b(true|false|null)\b|-?\b\d+(\.\d+)?\b/, 'literal'],
    [/[{}[\]=,]/, 'punct'],
  ],
};
const ALIAS = { yml: 'yaml', ps1: 'powershell', pwsh: 'powershell', ps: 'powershell', sh: 'bash', shell: 'bash', zsh: 'bash',
  terraform: 'hcl', tf: 'hcl' };
const LABEL = { yaml: 'YAML', json: 'JSON', powershell: 'PowerShell', bash: 'Bash', hcl: 'HCL', text: 'Text' };

function highlightLine(line, rules) {
  let out = '';
  let rest = line;
  let atStart = true;
  while (rest.length) {
    let best = null;
    for (const [re, kind] of rules) {
      if (re.source.startsWith('^') && !atStart) continue;
      const m = re.exec(rest);
      if (m && (best === null || m.index < best.m.index)) best = { m, kind };
    }
    if (!best) { out += esc(rest); break; }
    const { m, kind } = best;
    let text = m[0];
    let lead = '';
    // Line-anchored rules capture the indentation first; keep it unpainted.
    if ((kind === 'key' || kind === 'command') && m[1] !== undefined && /^\s*-?\s*$/.test(m[1])) { lead = m[1]; text = m[0].slice(lead.length); }
    out += esc(rest.slice(0, m.index)) + esc(lead) + paint[kind](text);
    rest = rest.slice(m.index + m[0].length);
    atStart = false;
  }
  return out;
}

export function codeCard(lang, code) {
  const key = ALIAS[lang] ?? lang;
  const rules = RULES[key];
  const body = code.replace(/\s+$/, '').split('\n')
    // A blank line would end the Markdown HTML block; blank code lines get a zero-width space instead.
    .map(l => (!l.trim() ? '&#8203;' : rules ? highlightLine(l, rules) : esc(l)))
    .join('\n');
  const label = LABEL[key] ?? (lang ? lang.toUpperCase() : 'Text');
  const edge = `1px solid ${C.frame}`;
  return [
    '<div style="overflow-x:auto;max-width:100%">',
    `<table style="border-collapse:separate;border-spacing:0;width:${WIDTH}px;font-family:${WORDS};font-size:14px;line-height:1.55;color:${C.text}">`,
    `<thead><tr><th scope="col" style="background:${C.band};color:${C.title};text-align:left;padding:10px 18px;font-family:${WORDS};font-size:12px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;border-bottom:3px solid ${C.blue};width:${WIDTH}px;box-sizing:border-box;border-top:${edge};border-left:${edge};border-right:${edge}">${esc(label)}</th></tr></thead>`,
    `<tbody><tr><td style="padding:0;background:${C.canvas};box-sizing:border-box;border-left:${edge};border-right:${edge};border-bottom:${edge}"><pre style="margin:0;padding:16px 18px;background:${C.canvas};color:${C.text};font-family:${CODE};font-size:13.5px;line-height:1.7;white-space:pre;overflow-x:auto;border:0;border-radius:0;width:100%;box-sizing:border-box">${body}</pre></td></tr></tbody>`,
    '</table>',
    '</div>',
  ].join('\n');
}

export function convertMarkdown(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^```\s*([\w+-]*)\s*$/);
    if (!open || open[1] === 'mermaid') {
      if (open) { // copy a mermaid fence unchanged
        out.push(lines[i]);
        while (++i < lines.length && !/^```\s*$/.test(lines[i])) out.push(lines[i]);
        if (i < lines.length) out.push(lines[i]);
        continue;
      }
      out.push(lines[i]);
      continue;
    }
    const code = [];
    while (++i < lines.length && !/^```\s*$/.test(lines[i])) code.push(lines[i]);
    out.push(codeCard(open[1].toLowerCase(), code.join('\n')));
  }
  return out.join('\n');
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('code-cards.mjs')) {
  const [input, output] = process.argv.slice(2);
  if (!input) { console.error('Usage: node code-cards.mjs <in.md> [out.md]'); process.exit(2); }
  const result = convertMarkdown(readFileSync(input, 'utf8'));
  if (output) writeFileSync(output, result); else process.stdout.write(result);
}
