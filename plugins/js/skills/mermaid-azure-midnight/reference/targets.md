# Render targets

| Target | Where | Diagrams | Icons | Status |
|---|---|---|---|---|
| `web` | mermaid.live, docs sites, VS Code Markdown preview | Templates as written | Yes | Checked with Mermaid 10, 11 and 12 |
| `web` | GitHub Markdown | Templates as written | Probably | Not checked yet |
| `ado` | Azure DevOps wiki, PR descriptions, repo file preview | Templates with the settings line on line 2 (`scripts/to-ado.mjs`) | Yes | Checked on the wiki 2026-09-30 |
| offline | PDF export, air-gapped docs | Templates as written | No, they load from the internet | Icons show as empty squares |

## Azure DevOps wiki

**The first line of every Mermaid block must be the diagram keyword** (`graph TB`, `sequenceDiagram`, ...). The
wiki answers "Unsupported diagram type." as soon as anything comes before it. Tested on the wiki:

| First lines of the block | Result |
|---|---|
| `graph TB` (no settings) | Renders |
| `%%{init: ...}%%` then `graph TB` | Unsupported diagram type |
| `%% comment` then `%%{init: ...}%%` then `graph TB` | Unsupported diagram type |
| `---` front matter (even `title:` only) then `graph TB` | Unsupported diagram type |
| `graph TB` then `%%{init: ...}%%` | **Renders with the full theme** |

With the settings line on line 2, everything in the templates renders as designed: Segoe UI Variable, the `bpCode`
Cascadia Code rule, connector label chips, icons, and the sequence `box` canvas.

Convert before publishing:

```bash
node <skill-dir>/scripts/to-ado.mjs page.md page.ado.md
node <skill-dir>/scripts/check-mermaid.mjs page.ado.md --target ado --versions 10,11
```

Why the templates keep the settings on line 1: Mermaid 10.9, 11 and 12 read a line-2 settings line, but 10.3 fails
to parse a flowchart that has one. Line 1 works in every renderer except the wiki, so only wiki copies are converted.

Other wiki rules from Microsoft's documentation:

- Use `graph`, not `flowchart`.
- No links to or from subgraphs.
- No long arrows (`---->`).
- No FontAwesome.
- Both `::: mermaid ... :::` blocks and standard ```` ```mermaid ```` fences render (fences since Sprint 274).
- The wiki does not load web fonts. The standard fonts (Segoe UI Variable, Cascadia Code) ship with Windows 11, so
  Windows readers see them as designed; other readers get the fallbacks in the font stacks.

## Styled tables

Styled tables are HTML with inline styles.

| Target | Result |
|---|---|
| VS Code preview, docs sites | As designed |
| Azure DevOps wiki | Colours, borders, fonts and the header rule are kept. `border-radius` is dropped, so the card corners, chips and pills show square |
| GitHub | Every `style` attribute is stripped; a plain table remains, so a GitHub-only file should use a plain Markdown table |

Details in `reference/tables.md`.

## Choosing when unsure

- The file lives in an Azure DevOps wiki repo, or the user mentions the wiki: `ado`.
- The file is a README or doc in a GitHub repo: `web`.
- The same file must serve both: keep the `web` source and publish a converted copy to the wiki.
