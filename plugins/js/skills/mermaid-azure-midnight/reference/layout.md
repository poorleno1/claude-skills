# Layout rules

Goal: no overlapping boxes, no crossing connectors, no connector through a box or a title, no clipped text.
`scripts/check-mermaid.mjs` tests all of these.

## Structure

- Use `graph TB`. Top-to-bottom reads well in narrow wiki columns; left-to-right diagrams get too wide and
  shrink the text.
- Wrap everything in one outer subgraph that acts as the canvas:
  ```text
  subgraph CANVAS[" "]
    direction TB
    ...
  end
  ```
  The canvas keeps the dark background on light pages. The `direction TB` line matters: a subgraph with no
  edges leaving it is laid out in the flipped direction, so without it the whole diagram turns sideways.
- Group steps into stage subgraphs with short numbered titles: `"1 · Validate"`, `"2 · DEV"`. Numbers only when
  the order is real.
- Declare all nodes inside their subgraphs first, then write all edges below. It keeps `linkStyle` numbering easy
  to follow.
- Aim for 15 nodes or fewer. Split bigger flows into an overview diagram plus one diagram per stage.

## Keep it a tree

The layout engine (dagre) can draw a tree with no crossings. Every extra cross-link risks one.

- Give each node one incoming main-flow edge.
- Hang side items off the main chain as leaves: artifacts, failure exits, logs.
- An artifact that a later step consumes is drawn as a source into that step: `TFD -.-> ADEV`. Do not also draw
  the edge from the step that produced it.
- Need to show a many-to-many relationship? Use a second diagram or a table.

## Titles and entry points

- Mermaid centres a stage title above the stage. A connector entering the stage from above lands on the entry
  node, which is also centred when it is alone on the top row, so the connector runs through the title.
- Fix: put two nodes on the stage's top row (the entry node plus a side source such as an artifact or secret
  store), or keep the triggering node inside the first stage.
- A subgraph holding a single node that is entered from above always collides. Drop the subgraph and put the
  resource name in the node text instead.
- Keep stage titles short. Long titles widen the collision zone.
- When several stages are entered from above and the node text already names each stage, blank the titles:
  `subgraph STG_PLAN[" "]` with `style STG_PLAN ... color:#10243f` (title colour = band colour). The bands keep
  grouping the nodes and nothing collides.

## Sequence diagrams

- Keep self-messages (`A->>A: ...`) on the first and last participant under about 24 characters. Mermaid centres
  the text on the lifeline, so longer text spills past the canvas edge.
- Put every message inside a `rect` band, and all participants inside the `box` canvas, so message text always sits
  on a dark background.

## Nodes

- Labels under about 30 characters. The flowchart config sets `wrappingWidth: 280`; longer labels wrap.
- Gates are hexagons `{{"..."}}`. Diamonds grow tall and wide with text.
- Never name a node `end` or start an id with `o` or `x` followed by a dash-arrow; Mermaid misreads them.
- Use CAF resource names in node text (`kv-myapp-prod`) and give those nodes the `bpCode` class.

## Edges

- Link nodes, never subgraph ids. Azure DevOps rejects subgraph links, and they produce awkward routing.
- Edge labels are fine when short (a few words, such as `no, build` or `PR into story`). The init line's
  `.edgeLabel` rules put them on a navy chip. Prefer node text when a label would sit in a dense area.
- A labelled bypass edge can replace a row of boxes: `QB -.->|yes, reuse| ASM` instead of a "skipped" node per
  branch. It halves the width of build-or-skip fan-outs.
- Use `-->` and `-.->` only. Longer arrows (`---->`) fail in Azure DevOps.

## Mermaid behaviours to remember

| Behaviour | Consequence | Rule |
|---|---|---|
| `themeVariables` value contains `-` or `'` | Whole init block ignored, default theme shown | No hyphens or single quotes in values |
| `%%{init}%%` single quotes | Converted to double quotes, breaks embedded quotes | Write init as strict JSON |
| Subgraph with no outgoing edges | Laid out in the flipped direction | `direction TB` in the canvas |
| `classDef ... font-family:A,B` | Comma splits the declaration; `\,` is not honoured | Fonts only via `themeCSS` |
| `<img>` in labels | Stacked above text, stretched to full width | Keep the `.nodeLabel img` rule in `themeCSS` |
| `@{ img: }` node | Light label bar, needs Mermaid 11.3 or later | Use `<img>` in labels instead |
| Mermaid 12 | Tighter layouts, different node placement | Check with `--versions 10,11,12` |
