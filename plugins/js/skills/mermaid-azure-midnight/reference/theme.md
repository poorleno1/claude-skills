# Theme: Azure Midnight

## Palette

| Token | Hex | Used for |
|---|---|---|
| canvas | `#0b1a2e` | Outer background (CANVAS subgraph, sequence box) |
| canvas border | `#1f3a5f` | Outer frame |
| stage | `#10243f` | Stage / group subgraph fill |
| stage border | `#24476f` | Stage frame, sequence lifelines |
| stage title | `#9cc3ea` | Subgraph titles, secondary text |
| text | `#e6f1ff` | Primary text |
| blue | `#3ca0ff` | Main connectors, arrowheads, process icons |
| Azure blue | `#0078d4` | Process node border |
| cyan | `#50e6ff` | Data and artifact connectors, data icons |
| amber | `#ffb900` | Human decisions |
| green | `#6ccb5f` | Success |
| red | `#f1707b` | Failure |

Icon tints use the same values: process `3ca0ff`, data `50e6ff`, decision `ffb900`, success `6ccb5f`,
error `f1707b`, neutral `e6f1ff`.

## Fonts

| Role | Font stack | Applied by |
|---|---|---|
| Words: stage titles, gates, outcomes, notes | `Segoe UI Variable Text, Segoe UI, Helvetica, Arial` | `themeVariables.fontFamily` |
| Code: commands, files, branches, resource names | `Cascadia Code, Cascadia Mono, Consolas, monospace` | `bpCode` class via `themeCSS` |

Both fonts ship with Windows 11, so Azure DevOps readers on Windows see them as designed without installing
anything (the wiki does not load web fonts). Elsewhere the stacks fall back to Segoe UI, Helvetica or Arial and to
Consolas or the system monospace. Mermaid sizes boxes with whatever font the reader has, so layouts stay intact.
Chosen 2026-09-30 from six rendered options (option E, "Windows native"); it replaces Geist and Geist Mono.

In HTML (tables, code cards) use the quoted stacks `'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif`
and `'Cascadia Code','Cascadia Mono',Consolas,monospace`. For large headings in HTML, `'Segoe UI Variable Display'`
at weight 650. Inside `themeVariables` keep the unquoted stacks above: quotes and hyphens there make Mermaid drop
the whole settings line.

## Flowchart init block

Paste as the first line. Do not reformat it: it must stay valid JSON on one line.

```text
%%{init: {"theme":"base","themeVariables":{"fontFamily":"Segoe UI Variable Text, Segoe UI, Helvetica, Arial","fontSize":"15px","primaryColor":"#0e2a4a","primaryBorderColor":"#0078d4","primaryTextColor":"#e6f1ff","textColor":"#e6f1ff","lineColor":"#3ca0ff","titleColor":"#9cc3ea","clusterBkg":"#10243f","clusterBorder":"#24476f","edgeLabelBackground":"#0b1a2e","background":"#0b1a2e"},"themeCSS":".nodeLabel img { display: inline-block !important; width: 18px !important; height: 18px !important; vertical-align: middle; margin: 0 8px 2px 0 !important; } .bpCode .nodeLabel { font-family: Cascadia Code, Cascadia Mono, Consolas, monospace; } .cluster-label .nodeLabel { font-weight: 600; letter-spacing: 0.01em; } .edgeLabel, .edgeLabel p, .edgeLabel span, .labelBkg { background-color: #0b1a2e !important; color: #9cc3ea !important; } .edgeLabel rect { fill: #0b1a2e !important; opacity: 1 !important; }","flowchart":{"curve":"basis","nodeSpacing":36,"rankSpacing":44,"padding":16,"wrappingWidth":280}}}%%
```

What each `themeCSS` rule does:

- `.nodeLabel img`: puts an icon left of its text at 18px. Without it Mermaid stacks the icon above the text and stretches it.
- `.bpCode .nodeLabel`: switches nodes with the `bpCode` class to Cascadia Code.
- `.cluster-label .nodeLabel`: semi-bold stage titles.
- `.edgeLabel ...` and `.edgeLabel rect`: puts connector labels on a navy chip in pale blue. Without them some
  Mermaid versions draw a light box behind the label.

For the Azure DevOps wiki, this line goes second, directly below `graph TB` or `sequenceDiagram`
(`scripts/to-ado.mjs` moves it). See `reference/targets.md`.

## Classes

Paste only the classes the diagram uses. Every value is fixed.

```text
  classDef bpUser fill:#132c4c,stroke:#6b8bb0,stroke-width:2px,color:#e6f1ff
  classDef bpProcess fill:#0e2a4a,stroke:#0078d4,stroke-width:2px,color:#e6f1ff
  classDef bpInfo fill:#004a8f,stroke:#3ca0ff,stroke-width:3px,color:#ffffff
  classDef bpData fill:#06323b,stroke:#50e6ff,stroke-width:2px,color:#d6fbff
  classDef bpDecision fill:#3a2c00,stroke:#ffb900,stroke-width:2px,color:#fff4ce
  classDef bpWarning fill:#3a2c00,stroke:#ffb900,stroke-width:2px,color:#fff4ce
  classDef bpSuccess fill:#0f2e17,stroke:#6ccb5f,stroke-width:2px,color:#dff6dd
  classDef bpError fill:#3b0f14,stroke:#f1707b,stroke-width:2px,color:#fde7e9
  classDef bpExternal fill:#0d1726,stroke:#3d5573,stroke-width:2px,color:#9cc3ea,stroke-dasharray:4 3
  classDef bpCode stroke-dasharray:0
```

| Class | Role | Shape |
|---|---|---|
| `bpUser` | Trigger, actor, users | Stadium `(["..."])` |
| `bpProcess` | A step: validate, plan, scan, a service doing work | Rectangle `["..."]` |
| `bpInfo` | The step that changes infrastructure: apply, deploy | Rectangle, thick border |
| `bpData` | Artifact, state, secret store, database, storage | Cylinder `[("...")]` |
| `bpDecision` | Human gate: approval, business-hours check | Hexagon `{{"..."}}` |
| `bpWarning` | Degraded or caution state | Rectangle |
| `bpSuccess` | Final good outcome | Stadium |
| `bpError` | Failure path | Rectangle |
| `bpExternal` | Outside your control: third party, internet edge | Rectangle, dashed border |
| `bpCode` | Font only. Add to any node whose text is code | Any |

A node takes one colour class and optionally `bpCode`, on separate `class` lines:

```text
  class PDEV,PUAT bpProcess
  class PDEV,PUAT bpCode
```

## Subgraph styles

```text
  style CANVAS fill:#0b1a2e,stroke:#1f3a5f,stroke-width:1px,color:#0b1a2e
  style <STAGE_ID> fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea
```

The canvas title colour equals its fill, so its placeholder title `" "` stays invisible.

## Connector styles

```text
  linkStyle default stroke:#3ca0ff,stroke-width:2px
  linkStyle <data edges> stroke:#50e6ff,stroke-width:1.5px,stroke-dasharray:4 4
  linkStyle <failure edges> stroke:#f1707b,stroke-width:2px,stroke-dasharray:5 4
```

- Solid blue `-->`: the main flow.
- Dashed cyan `-.->`: artifacts, secrets, telemetry, data.
- Dashed red `-.->`: failure path.
- Avoid edge labels. Put the meaning in the node text instead.

## Sequence diagrams

Sequence diagrams ignore `classDef`, `style` and icons. Use this init block and wrap all participants in
`box rgb(11, 26, 46)` so the dark canvas covers the diagram. Group phases with `rect rgb(16, 36, 63)`.
Notes use the amber decision colours, so keep them for approvals and waits.

```text
%%{init: {"theme":"base","themeVariables":{"fontFamily":"Segoe UI Variable Text, Segoe UI, Helvetica, Arial","fontSize":"15px","background":"#0b1a2e","primaryTextColor":"#e6f1ff","textColor":"#e6f1ff","lineColor":"#3ca0ff","actorBkg":"#0e2a4a","actorBorder":"#0078d4","actorTextColor":"#e6f1ff","actorLineColor":"#24476f","signalColor":"#3ca0ff","signalTextColor":"#e6f1ff","labelBoxBkgColor":"#10243f","labelBoxBorderColor":"#24476f","labelTextColor":"#9cc3ea","loopTextColor":"#9cc3ea","noteBkgColor":"#3a2c00","noteBorderColor":"#ffb900","noteTextColor":"#fff4ce","activationBkgColor":"#004a8f","activationBorderColor":"#3ca0ff","sequenceNumberColor":"#0b1a2e"},"sequence":{"mirrorActors":false,"messageMargin":40,"boxMargin":12,"actorMargin":60,"width":190,"noteMargin":12}}}%%
```

## Other diagram types

For `stateDiagram-v2`, `erDiagram` and `classDiagram`, reuse the flowchart `themeVariables` (drop
`themeCSS` and `flowchart`) and the same `classDef` lines where the type supports them. These types have not
been through the layout checker; look at the rendered result before handing it over.
