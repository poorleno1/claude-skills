# Template: Azure application architecture

A web app behind Front Door, with its data services in one resource group and logs sent to a shared workspace.
The flow is a tree (every service has one parent), which keeps it free of crossing lines.
Solid lines carry requests; dashed cyan lines carry secrets, data or telemetry.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"Segoe UI Variable Text, Segoe UI, Helvetica, Arial","fontSize":"15px","primaryColor":"#0e2a4a","primaryBorderColor":"#0078d4","primaryTextColor":"#e6f1ff","textColor":"#e6f1ff","lineColor":"#3ca0ff","titleColor":"#9cc3ea","clusterBkg":"#10243f","clusterBorder":"#24476f","edgeLabelBackground":"#0b1a2e","background":"#0b1a2e"},"themeCSS":".nodeLabel img { display: inline-block !important; width: 18px !important; height: 18px !important; vertical-align: middle; margin: 0 8px 2px 0 !important; } .bpCode .nodeLabel { font-family: Cascadia Code, Cascadia Mono, Consolas, monospace; } .cluster-label .nodeLabel { font-weight: 600; letter-spacing: 0.01em; } .edgeLabel, .edgeLabel p, .edgeLabel span, .labelBkg { background-color: #0b1a2e !important; color: #9cc3ea !important; } .edgeLabel rect { fill: #0b1a2e !important; opacity: 1 !important; }","flowchart":{"curve":"basis","nodeSpacing":36,"rankSpacing":44,"padding":16,"wrappingWidth":280}}}%%
graph TB
  subgraph CANVAS[" "]
    direction TB
    USR(["<img src='https://api.iconify.design/fluent/people-team-24-regular.svg?color=%23e6f1ff' width='18' height='18'/> Users"])
    AFD["<img src='https://api.iconify.design/fluent/globe-24-regular.svg?color=%23e6f1ff' width='18' height='18'/> afd-myapp-prod"]
    subgraph RG["rg-app-myapp-prod"]
      KV[("<img src='https://api.iconify.design/fluent/key-24-regular.svg?color=%2350e6ff' width='18' height='18'/> kv-myapp-prod")]
      APP["<img src='https://api.iconify.design/fluent/window-24-regular.svg?color=%233ca0ff' width='18' height='18'/> app-web-myapp-prod"]
      SQL[("<img src='https://api.iconify.design/devicon/azuresqldatabase.svg' width='18' height='18'/> sqldb-myapp-prod")]
      FUNC["<img src='https://api.iconify.design/fluent/flash-24-regular.svg?color=%233ca0ff' width='18' height='18'/> func-jobs-myapp-prod"]
      ST[("<img src='https://api.iconify.design/fluent/hard-drive-24-regular.svg?color=%2350e6ff' width='18' height='18'/> stmyappprod")]
    end
    LOG["<img src='https://api.iconify.design/fluent/data-trending-24-regular.svg?color=%233ca0ff' width='18' height='18'/> log-shared-prod"]
  end

  USR --> AFD
  AFD --> APP
  KV -.-> APP
  APP --> SQL
  APP --> FUNC
  FUNC --> ST
  APP -.-> LOG

  classDef bpUser fill:#132c4c,stroke:#6b8bb0,stroke-width:2px,color:#e6f1ff
  classDef bpProcess fill:#0e2a4a,stroke:#0078d4,stroke-width:2px,color:#e6f1ff
  classDef bpData fill:#06323b,stroke:#50e6ff,stroke-width:2px,color:#d6fbff
  classDef bpExternal fill:#0d1726,stroke:#3d5573,stroke-width:2px,color:#9cc3ea,stroke-dasharray:4 3
  classDef bpCode stroke-dasharray:0
  class USR bpUser
  class AFD bpExternal
  class APP,FUNC,LOG bpProcess
  class KV,SQL,ST bpData
  class AFD,APP,FUNC,LOG,KV,SQL,ST bpCode

  style CANVAS fill:#0b1a2e,stroke:#1f3a5f,stroke-width:1px,color:#0b1a2e
  style RG fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea

  linkStyle default stroke:#3ca0ff,stroke-width:2px
  linkStyle 2,6 stroke:#50e6ff,stroke-width:1.5px,stroke-dasharray:4 4
```
