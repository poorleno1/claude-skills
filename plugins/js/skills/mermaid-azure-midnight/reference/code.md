# Code blocks

Code samples get the same look as the tables: a navy header band with the language name and a thick blue rule, the
code on the dark canvas in Cascadia Code, and syntax colours from the palette.

## Make them

Write normal fenced code blocks, then convert the file:

```bash
node <skill-dir>/scripts/code-cards.mjs page.md page.cards.md
```

The script turns every fenced block into a code card and leaves ```` ```mermaid ```` fences and `::: mermaid` blocks
alone. Run it after `to-ado.mjs` when publishing to the Azure DevOps wiki; the order does not matter.

Use code cards for pages that are read in the Azure DevOps wiki or VS Code preview. Keep plain fences for GitHub-only
files: GitHub strips the styles, and its own highlighting is better than an uncoloured card.

## Colours

| Token | Colour | Examples |
|---|---|---|
| Commands, functions, block keywords | `#3ca0ff` | `az acr import`, `Get-ChildItem`, `and(`, `resource` |
| Variables, keys | `#50e6ff` | `$RegistryName`, `condition:`, `"version":`, `var.location` |
| Parameters, flags | `#9cc3ea` | `--name`, `-Path`, `\|` block markers |
| Strings | `#ffb900` | `"rg-app-myapp-dev"`, `'Succeeded'` |
| Literals | `#3ca0ff` | `true`, `null`, numbers |
| Comments, punctuation | `#6b8bb0` (comments in italics) | `# No native task`, `{ } ( ) ,` |
| Everything else | `#e6f1ff` | |

Languages: `yaml` (`yml`), `json`, `powershell` (`ps1`, `pwsh`), `bash` (`sh`, `shell`), `hcl` (`terraform`, `tf`).
Other languages get an uncoloured card with their name in the header.

## Rules

- The cards follow the table rules in `reference/tables.md`: painted on the cells only, 1040px wide. The `<pre>`
  fills its cell and scrolls long lines itself.
- Blank lines inside the code become a zero-width space line (`&#8203;`). A truly blank line would end the Markdown
  HTML block and break the card.
- Do not edit a generated card by hand. Change the fenced source and run the script again.
