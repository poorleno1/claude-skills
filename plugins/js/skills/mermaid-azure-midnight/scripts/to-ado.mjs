#!/usr/bin/env node
// Prepares the Mermaid blocks of a Markdown file for the Azure DevOps wiki.
//
// Usage:
//   node to-ado.mjs <in.md> [out.md]      (writes to stdout when out.md is omitted)
//
// The wiki answers "Unsupported diagram type." when the first line of a Mermaid block is not the diagram keyword
// (graph, sequenceDiagram, ...). That rules out a %%{init}%% line, a %% comment or a --- front matter block at the
// top, all of which the templates and most tools put there. Mermaid also reads %%{init}%% lines further down, so
// this script moves the settings line (and any comment lines) below the keyword. Nothing else changes: fonts,
// icons, the sequence box canvas and every other setting render on the wiki as designed.
//
// Verified on the wiki 2026-09-30. Mermaid 10.9, 11 and 12 apply a line-2 settings line; 10.3 does not for
// flowcharts, which is why the templates keep it on line 1 and only wiki copies are converted.

import { readFileSync, writeFileSync } from 'node:fs';

const KEYWORD = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(-v2)?|erDiagram|journey|gantt|pie|requirementDiagram|gitGraph|timeline|mindmap|quadrantChart|xychart(-beta)?|sankey(-beta)?|block(-beta)?|C4\w+)\b/;

export function toAdo(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const at = lines.findIndex(l => KEYWORD.test(l.trim()));
  if (at <= 0) return src; // already starts with the keyword, or no keyword found
  const before = lines.slice(0, at).filter(l => l.trim() && !/^---\s*$/.test(l.trim()));
  if (lines.slice(0, at).some(l => /^---\s*$/.test(l.trim()))) {
    throw new Error('front matter (---) is not supported on the wiki; use a %%{init}%% line instead');
  }
  return [lines[at], ...before, ...lines.slice(at + 1)].join('\n');
}

export function convertMarkdown(text) {
  return text.replace(/\r\n/g, '\n').replace(/^(```mermaid|::: ?mermaid)\n([\s\S]*?)^(```|:::)[ \t]*$/gm,
    (_, open, src, close) => `${open}\n${toAdo(src.trimEnd())}\n${close}`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('to-ado.mjs')) {
  const [input, output] = process.argv.slice(2);
  if (!input) { console.error('Usage: node to-ado.mjs <in.md> [out.md]'); process.exit(2); }
  const result = convertMarkdown(readFileSync(input, 'utf8'));
  if (output) writeFileSync(output, result); else process.stdout.write(result);
}
