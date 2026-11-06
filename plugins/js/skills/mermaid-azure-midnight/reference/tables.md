# Tables

Styled tables in the Azure Midnight palette, matching the diagrams. Markdown tables have no styling syntax, so
each styled table is an HTML `<table>` block with inline styles, pasted into the Markdown file.

## Pick a style

| Style | Template | Use for |
|---|---|---|
| Detailed (default) | `templates/table-detailed.md` | Rows that need a sentence or two: pipeline stages, runbooks, change plans, release notes. Code chips inside the prose, a status pill per row |
| Simple | `templates/table-simple.md` | Inventories and catalogues: a thing, its name, a description. No chips or pills |
| Plain Markdown | none | Tables for GitHub only, or tiny tables inside lists. GitHub strips styles anyway |

Both styled tables share one look:

- Dark card: navy `#0b1a2e` cells, rows banded with `#10243f`, thin `#1f3a5f` lines. Never a white or transparent body.
- Painted on the cells only. The `<table>` element carries no background or border (see Writing rules).
- Fixed width: columns in pixels that add up to 1040px, so every table has the same width.
- Header: full-width `#0e2a4a` band, pale-blue `#9cc3ea` capitals, 12px semi-bold, and a thick 3px `#3ca0ff` rule under it.
- Text: white `#e6f1ff` in Segoe UI Variable. Names and commands in Cascadia Code, cyan `#50e6ff`.
- Icons in the first column when a fitting one exists in `reference/icons.md`. Optional; leave them out rather than force a weak match.
- One to four columns. Wider data belongs in a plain Markdown table or a separate file.

## Build one

Start from a template and change the text. Keep every `style` attribute as it is. To build from scratch, use these
parts.

**Table and header**

```html
<table style="border-collapse:separate;border-spacing:0;width:1040px;font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#e6f1ff">
<thead>
<tr><th scope="col" style="background:#0e2a4a;color:#9cc3ea;text-align:left;padding:13px 18px;font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;border-bottom:3px solid #3ca0ff;width:260px;box-sizing:border-box;border-top:1px solid #1f3a5f;border-left:1px solid #1f3a5f">Header</th></tr>
</thead>
<tbody>
```

Repeat the `<th>` once per column. Give each header a pixel `width`; the widths must add up to 1040px. Weight them by
content: short IDs and names narrow (about 100 to 180px), prose wide.

**Cells.** Rows alternate background. The first row has no top border. Every cell has `box-sizing:border-box`.

```html
<td style="padding:13px 18px;vertical-align:top;background:#0b1a2e;box-sizing:border-box">...</td>
<td style="padding:13px 18px;vertical-align:top;background:#10243f;border-top:1px solid #1f3a5f;box-sizing:border-box">...</td>
<td style="padding:13px 18px;vertical-align:top;background:#0b1a2e;border-top:1px solid #1f3a5f;box-sizing:border-box">...</td>
```

**Frame.** Drawn by the cells, not the table: `border-top:1px solid #1f3a5f` on the header cells,
`border-left` on every first-column cell, `border-right` on every last-column cell and `border-bottom` on the cells
of the last row.

Append these to a cell's `style` by column role:

| Column role | Add to the cell style |
|---|---|
| First column (the thing) | `font-weight:600;white-space:nowrap;width:1%;` |
| Name column, simple style (cyan mono) | `font-family:'Cascadia Code','Cascadia Mono',Consolas,monospace;font-size:13.5px;color:#50e6ff;white-space:nowrap;width:1%;` |
| Prose column with chips, detailed style | `line-height:1.9;` (room for chips between lines) |
| Status column | `white-space:nowrap;width:1%;` |

**Code chips** (rounded, bordered). Cyan for names, files and commands; blue for regions, versions and
secondary references.

```html
<code style="display:inline-block;padding:2px 9px;border-radius:6px;background:#06323b;color:#50e6ff;border:1px solid rgba(80,230,255,0.4);font-family:'Cascadia Code','Cascadia Mono',Consolas,monospace;font-size:12.5px;line-height:1.6;white-space:nowrap">tfplan-uat</code>
<code style="display:inline-block;padding:2px 9px;border-radius:6px;background:#0e2a4a;color:#3ca0ff;border:1px solid rgba(0,120,212,0.7);font-family:'Cascadia Code','Cascadia Mono',Consolas,monospace;font-size:12.5px;line-height:1.6;white-space:nowrap">northeurope</code>
```

**Status pills** (fully rounded, coloured dot). Pick by meaning, as in the diagrams:

| Pill | Meaning |
|---|---|
| Green | Done, passed, healthy, private |
| Amber | Waiting on a person, partly exposed, medium |
| Red | Blocked, failed, high risk |
| Blue | Informational, low |
| Grey | Not started, shared, neutral |

```html
<span style="display:inline-block;padding:2px 11px;border-radius:999px;background:#0f2e17;color:#6ccb5f;border:1px solid rgba(108,203,95,0.55);font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.03em;line-height:1.7;white-space:nowrap"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#6ccb5f;margin-right:7px;vertical-align:1px"></span>Passed</span>
<span style="display:inline-block;padding:2px 11px;border-radius:999px;background:#3a2c00;color:#ffb900;border:1px solid rgba(255,185,0,0.55);font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.03em;line-height:1.7;white-space:nowrap"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#ffb900;margin-right:7px;vertical-align:1px"></span>Waiting</span>
<span style="display:inline-block;padding:2px 11px;border-radius:999px;background:#3b0f14;color:#f1707b;border:1px solid rgba(241,112,123,0.55);font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.03em;line-height:1.7;white-space:nowrap"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#f1707b;margin-right:7px;vertical-align:1px"></span>Blocked</span>
<span style="display:inline-block;padding:2px 11px;border-radius:999px;background:#0e2a4a;color:#3ca0ff;border:1px solid rgba(60,160,255,0.55);font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.03em;line-height:1.7;white-space:nowrap"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#3ca0ff;margin-right:7px;vertical-align:1px"></span>Low</span>
<span style="display:inline-block;padding:2px 11px;border-radius:999px;background:#10243f;color:#9cc3ea;border:1px solid rgba(156,195,234,0.4);font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.03em;line-height:1.7;white-space:nowrap"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#9cc3ea;margin-right:7px;vertical-align:1px"></span>Not started</span>
```

**Icon** at the start of a first-column cell (same Iconify rules as the diagrams):

```html
<img src="https://api.iconify.design/fluent/shield-task-24-regular.svg?color=%233ca0ff" width="18" height="18" alt="" style="vertical-align:-4px;margin-right:10px">Validate
```

## Writing rules

- Never put a background, border, rounded corners or `overflow` on the `<table>` element. The Azure DevOps wiki
  lays every table out as a block as wide as the page and ignores an inline `display:table`, so anything painted on
  the table itself shows as an empty dark band to the right of the rows. Paint the cells; the checker warns otherwise.
- Fix the width with pixel `width` on the header cells (adding up to 1040px) plus `box-sizing:border-box` on every
  cell. Percentages and `max-width` do not hold on the wiki, and without fixed widths the columns squeeze as the
  window narrows.
- Wrap each table in `<div style="overflow-x:auto;max-width:100%">` ... `</div>` (same HTML block, no blank lines),
  so a wide table scrolls inside its own box on narrow screens. Do not force `white-space:nowrap` on whole prose or
  status cells; the pills and short chips already keep themselves on one line.
- No blank lines anywhere between `<table>` and `</table>`. A blank line ends the Markdown HTML block and the
  rest of the table shows as raw text.
- Do not indent the HTML by four or more spaces; Markdown turns it into a code block. Keep lines flush left.
- Markdown does not work inside cells. Use `<code>` chips (not backticks), `<b>`, `<br>` and `<a href>`.
- Keep prose cells to one or two sentences. Longer text belongs in the page body.
- Every styled table needs a plain Markdown fallback when the file is also read on GitHub. Put it in the
  GitHub copy of the document, not next to the styled table.
- Colours only from the palette above; the checker warns on anything else.

## Where they render

| Target | Result |
|---|---|
| VS Code preview, docs sites | As designed |
| Azure DevOps wiki | Colours, borders, fonts and the header rule render. `border-radius` is dropped, so corners, chips and pills are square |
| GitHub | Styles stripped; shows a plain table with chips as inline code |
| Offline | As designed, except icons (they load from the internet) |

Check tables with the same script as diagrams; it lints every `<table>` block in the file:

```bash
node <skill-dir>/scripts/check-mermaid.mjs page.md --static
```
