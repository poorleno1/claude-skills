# Template: flowchart starter

Copy this block, keep the `%%{init}%%` line, the class definitions and the styles as they are, and replace the
nodes and edges. Remove the `<img .../>` parts for the Azure DevOps wiki.

Checklist while editing:

- Keep the outer `CANVAS` subgraph and its `direction TB` line.
- Link nodes to nodes. Never link to a subgraph id.
- Count edges from 0 in the order they are written; `linkStyle` uses those numbers.
- Add every command, file name and resource name to the `bpCode` class line.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"Segoe UI Variable Text, Segoe UI, Helvetica, Arial","fontSize":"15px","primaryColor":"#0e2a4a","primaryBorderColor":"#0078d4","primaryTextColor":"#e6f1ff","textColor":"#e6f1ff","lineColor":"#3ca0ff","titleColor":"#9cc3ea","clusterBkg":"#10243f","clusterBorder":"#24476f","edgeLabelBackground":"#0b1a2e","background":"#0b1a2e"},"themeCSS":".nodeLabel img { display: inline-block !important; width: 18px !important; height: 18px !important; vertical-align: middle; margin: 0 8px 2px 0 !important; } .bpCode .nodeLabel { font-family: Cascadia Code, Cascadia Mono, Consolas, monospace; } .cluster-label .nodeLabel { font-weight: 600; letter-spacing: 0.01em; } .edgeLabel, .edgeLabel p, .edgeLabel span, .labelBkg { background-color: #0b1a2e !important; color: #9cc3ea !important; } .edgeLabel rect { fill: #0b1a2e !important; opacity: 1 !important; }","flowchart":{"curve":"basis","nodeSpacing":36,"rankSpacing":44,"padding":16,"wrappingWidth":280}}}%%
graph TB
  subgraph CANVAS[" "]
    direction TB
    subgraph S1["1 · Build"]
      A(["<img src='https://api.iconify.design/fluent/branch-24-regular.svg?color=%233ca0ff' width='18' height='18'/> main"])
      B["<img src='https://api.iconify.design/fluent/window-console-20-regular.svg?color=%233ca0ff' width='18' height='18'/> build.ps1"]
      X["<img src='https://api.iconify.design/fluent/dismiss-circle-24-regular.svg?color=%23f1707b' width='18' height='18'/> Fail: notify"]
    end
    subgraph S2["2 · Deploy"]
      P["<img src='https://api.iconify.design/fluent/clipboard-task-list-ltr-24-regular.svg?color=%233ca0ff' width='18' height='18'/> what-if"]
      D{{"<img src='https://api.iconify.design/fluent/person-available-24-regular.svg?color=%23ffb900' width='18' height='18'/> Approval"}}
      C[("<img src='https://api.iconify.design/fluent/box-24-regular.svg?color=%2350e6ff' width='18' height='18'/> drop.zip")]
      E["<img src='https://api.iconify.design/fluent/cloud-arrow-up-24-regular.svg?color=%23e6f1ff' width='18' height='18'/> deploy"]
    end
    Z(["<img src='https://api.iconify.design/fluent/checkmark-circle-24-regular.svg?color=%236ccb5f' width='18' height='18'/> Done"])
  end

  A --> B
  B -.-> X
  B --> P
  P --> D
  D --> E
  C -.-> E
  E --> Z

  classDef bpUser fill:#132c4c,stroke:#6b8bb0,stroke-width:2px,color:#e6f1ff
  classDef bpProcess fill:#0e2a4a,stroke:#0078d4,stroke-width:2px,color:#e6f1ff
  classDef bpInfo fill:#004a8f,stroke:#3ca0ff,stroke-width:3px,color:#ffffff
  classDef bpData fill:#06323b,stroke:#50e6ff,stroke-width:2px,color:#d6fbff
  classDef bpDecision fill:#3a2c00,stroke:#ffb900,stroke-width:2px,color:#fff4ce
  classDef bpSuccess fill:#0f2e17,stroke:#6ccb5f,stroke-width:2px,color:#dff6dd
  classDef bpError fill:#3b0f14,stroke:#f1707b,stroke-width:2px,color:#fde7e9
  classDef bpCode stroke-dasharray:0
  class A bpUser
  class B,P bpProcess
  class E bpInfo
  class C bpData
  class D bpDecision
  class Z bpSuccess
  class X bpError
  class A,B,P,C,E bpCode

  style CANVAS fill:#0b1a2e,stroke:#1f3a5f,stroke-width:1px,color:#0b1a2e
  style S1 fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea
  style S2 fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea

  linkStyle default stroke:#3ca0ff,stroke-width:2px
  linkStyle 1 stroke:#f1707b,stroke-width:2px,stroke-dasharray:5 4
  linkStyle 5 stroke:#50e6ff,stroke-width:1.5px,stroke-dasharray:4 4
```
