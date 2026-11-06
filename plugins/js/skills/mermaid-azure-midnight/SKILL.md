---
name: mermaid-azure-midnight
description: Make Markdown documents look polished in the Azure Midnight house style (dark navy theme, Segoe UI Variable and Cascadia Code fonts, Iconify icons). Covers Mermaid diagrams, styled tables and syntax-coloured code blocks for Azure, Azure DevOps, Terraform and pipeline documentation. Use whenever the user asks for a Mermaid diagram, flowchart, pipeline diagram, architecture diagram, sequence diagram or wiki diagram, asks for a table or nicer code blocks in a Markdown file or wiki page, or wants a Markdown document or Azure DevOps wiki page to look better.
---

# Azure Midnight: diagrams and tables for Markdown

Produces diagrams and tables that share one look: dark navy surfaces, Azure blue and cyan accents, Segoe UI
Variable for words, Cascadia Code for anything typed in a terminal, and small tinted icons. Every rule here was verified by
rendering: diagrams with Mermaid 10, 11 and 12, tables through a Markdown renderer.

## Pick the render target first

- `web`: GitHub, VS Code preview, mermaid.live, docs sites. Icons allowed. Templates are written for this profile.
- `ado`: Azure DevOps wiki. The first line of every Mermaid block must be the diagram keyword, or the wiki shows
  **"Unsupported diagram type."** Write the normal version, then convert it with `scripts/to-ado.mjs`, which moves
  the settings line below the keyword. Fonts, icons and the sequence canvas all render there.

GitHub strips all inline styles, so styled tables show there as plain tables. The Azure DevOps wiki keeps table
colours but drops rounded corners. See `reference/targets.md` when unsure.

## Diagrams

1. **Pick the type.** Steps, pipelines, architecture: `graph TB`. Messages between systems over time:
   `sequenceDiagram`. Other types: apply the palette from `reference/theme.md` where the type allows it.
2. **Copy the closest template** and keep its `%%{init}%%` line, `classDef` lines and `style` lines unchanged.
   Edit nodes and edges only.
   - `templates/flowchart-starter.md`: blank skeleton, two stages.
   - `templates/pipeline-terraform.md`: approved multi-environment Terraform pipeline (with and without icons).
   - `templates/architecture-azure.md`: Azure application architecture.
   - `templates/sequence-azure.md`: sequence diagram.
3. **Assign classes by role** (full table in `reference/theme.md`): `bpProcess` step, `bpInfo` change to
   infrastructure (apply, deploy), `bpData` artifact or data store, `bpDecision` human gate, `bpSuccess`,
   `bpError`, `bpUser` trigger or actor, `bpExternal` outside your control. Add `bpCode` to every node whose
   text is a command, file, branch or resource name.
4. **Add icons** for the `web` target from `reference/icons.md`. One brand logo where a product enters the flow;
   tinted Fluent icons for everything else.
5. **Follow the layout rules** in `reference/layout.md`. The short version:
   - Keep the outer `CANVAS` subgraph with `direction TB`.
   - Keep the flow a tree. Side items (artifacts, failures) hang off as leaves.
   - Link nodes, never subgraphs. Use hexagons `{{"..."}}` for gates, not diamonds.
   - A stage entered from above needs two or more nodes on its top row, or the connector crosses its title.
6. **Save** in a ```` ```mermaid ```` fence (Azure DevOps also accepts `::: mermaid`). For `ado`, convert the
   file before publishing: `node <skill-dir>/scripts/to-ado.mjs page.md page.ado.md`.

## Tables

1. **Pick the style** (details in `reference/tables.md`):
   - **Detailed** (default), `templates/table-detailed.md`: a sentence or two per row, cyan code chips inside the
     prose, a rounded status pill per row. Pipeline stages, runbooks, change plans.
   - **Simple**, `templates/table-simple.md`: a thing, its name in cyan mono, a description. Inventories and
     catalogues.
   - Plain Markdown table: only for GitHub-only files or tiny tables inside lists.
2. **Copy the template** and change only the text, keeping every `style` attribute. One to four columns.
3. **Icons** in the first column when a fitting one exists; leave them out otherwise.
4. **Status pills by meaning**: green done or healthy, amber waiting on a person, red blocked, blue informational,
   grey not started.
5. **Keep the HTML block intact**: no blank lines inside `<table>`, no indentation of four spaces or more, and
   `<code>` or `<b>` instead of Markdown syntax inside cells.

## Code blocks

Write normal fenced code, then run `node <skill-dir>/scripts/code-cards.mjs page.md page.cards.md`. Every fence
except Mermaid becomes a code card: navy language header with the blue rule, Cascadia Code, palette syntax colours.
Use them for wiki and VS Code pages; keep plain fences for GitHub-only files. Details in `reference/code.md`.

## Check before handing over

```bash
node <skill-dir>/scripts/check-mermaid.mjs <file.md> --target web --versions 10,11,12
node <skill-dir>/scripts/check-mermaid.mjs <file.ado.md> --target ado --versions 10,11
```

It renders every diagram and lints every styled table in the file. For `ado` files the checker also fails any block
whose first line is not the diagram keyword. Fix every `error`. Run `npm install` in
`scripts/` once first. `--png <dir>` saves diagram screenshots; `--static` lints without a browser.

## Hard rules

- Use only the palette in `reference/theme.md`. No other colours; never a white table or diagram background.
- No emoji anywhere.
- `themeVariables` values must not contain `-` or `'`. Mermaid silently drops the whole theme otherwise.
  Write font stacks without quotes and without `sans-serif`.
- Never put `font-family` in a `classDef`; commas break it. Fonts go in `themeCSS`.
- Count edges from 0 in source order; `linkStyle` numbers must match after every edit.
- Keep diagram labels under about 30 characters and table prose cells to one or two sentences.
- Do not use `@{ img: }`, `@{ icon: }` or `fa:` icons in Markdown. See `reference/icons.md` for why.

## References

| File | Load when |
|---|---|
| `reference/theme.md` | Any diagram: colours, classes and the init block |
| `reference/layout.md` | Building or fixing a flowchart layout |
| `reference/tables.md` | Any styled table: styles, building blocks, pills, writing rules |
| `reference/code.md` | Code blocks: code cards, syntax colours, supported languages |
| `reference/icons.md` | Adding icons to a diagram or table (web target) |
| `reference/targets.md` | Unsure where the file will render, or it renders wrong there |
