# Template: Terraform multi-environment pipeline

Approved reference diagram. Validate, then DEV, UAT with approval, PROD with approval and business-hours check.
Each environment applies its own saved plan.

## With icons (GitHub, VS Code, docs sites)

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"Segoe UI Variable Text, Segoe UI, Helvetica, Arial","fontSize":"15px","primaryColor":"#0e2a4a","primaryBorderColor":"#0078d4","primaryTextColor":"#e6f1ff","textColor":"#e6f1ff","lineColor":"#3ca0ff","titleColor":"#9cc3ea","clusterBkg":"#10243f","clusterBorder":"#24476f","edgeLabelBackground":"#0b1a2e","background":"#0b1a2e"},"themeCSS":".nodeLabel img { display: inline-block !important; width: 18px !important; height: 18px !important; vertical-align: middle; margin: 0 8px 2px 0 !important; } .bpCode .nodeLabel { font-family: Cascadia Code, Cascadia Mono, Consolas, monospace; } .cluster-label .nodeLabel { font-weight: 600; letter-spacing: 0.01em; } .edgeLabel, .edgeLabel p, .edgeLabel span, .labelBkg { background-color: #0b1a2e !important; color: #9cc3ea !important; } .edgeLabel rect { fill: #0b1a2e !important; opacity: 1 !important; }","flowchart":{"curve":"basis","nodeSpacing":36,"rankSpacing":44,"padding":16,"wrappingWidth":280}}}%%
graph TB
  subgraph CANVAS[" "]
    direction TB
    subgraph VAL["1 · Validate"]
      TRG(["<img src='https://api.iconify.design/devicon/azuredevops.svg' width='18' height='18'/> main · terraform/**"])
      FMT["<img src='https://api.iconify.design/logos/terraform-icon.svg' width='18' height='18'/> fmt + validate"]
      SCAN["<img src='https://api.iconify.design/fluent/shield-task-24-regular.svg?color=%233ca0ff' width='18' height='18'/> tflint + checkov"]
      STOP["<img src='https://api.iconify.design/fluent/dismiss-circle-24-regular.svg?color=%23f1707b' width='18' height='18'/> Fail: stop and notify"]
    end
    subgraph DEV["2 · DEV"]
      PDEV["<img src='https://api.iconify.design/fluent/clipboard-task-list-ltr-24-regular.svg?color=%233ca0ff' width='18' height='18'/> terraform plan"]
      TFD[("<img src='https://api.iconify.design/fluent/document-lock-24-regular.svg?color=%2350e6ff' width='18' height='18'/> tfplan-dev")]
      ADEV["<img src='https://api.iconify.design/fluent/cloud-arrow-up-24-regular.svg?color=%23e6f1ff' width='18' height='18'/> terraform apply"]
    end
    subgraph UAT["3 · UAT"]
      PUAT["<img src='https://api.iconify.design/fluent/clipboard-task-list-ltr-24-regular.svg?color=%233ca0ff' width='18' height='18'/> terraform plan"]
      TFU[("<img src='https://api.iconify.design/fluent/document-lock-24-regular.svg?color=%2350e6ff' width='18' height='18'/> tfplan-uat")]
      GUAT{{"<img src='https://api.iconify.design/fluent/person-available-24-regular.svg?color=%23ffb900' width='18' height='18'/> Approval"}}
      AUAT["<img src='https://api.iconify.design/fluent/cloud-arrow-up-24-regular.svg?color=%23e6f1ff' width='18' height='18'/> terraform apply"]
    end
    subgraph PRD["4 · PROD"]
      PPRD["<img src='https://api.iconify.design/fluent/clipboard-task-list-ltr-24-regular.svg?color=%233ca0ff' width='18' height='18'/> terraform plan"]
      TFP[("<img src='https://api.iconify.design/fluent/document-lock-24-regular.svg?color=%2350e6ff' width='18' height='18'/> tfplan-prod")]
      GPRD{{"<img src='https://api.iconify.design/fluent/calendar-clock-24-regular.svg?color=%23ffb900' width='18' height='18'/> Approval + hours"}}
      APRD["<img src='https://api.iconify.design/fluent/cloud-arrow-up-24-regular.svg?color=%23e6f1ff' width='18' height='18'/> terraform apply"]
    end
    DONE(["<img src='https://api.iconify.design/fluent/checkmark-circle-24-regular.svg?color=%236ccb5f' width='18' height='18'/> Released"])
  end

  TRG --> FMT
  FMT --> SCAN
  SCAN -.-> STOP
  SCAN --> PDEV
  PDEV --> ADEV
  TFD -.-> ADEV
  ADEV --> PUAT
  PUAT --> GUAT
  GUAT --> AUAT
  TFU -.-> AUAT
  AUAT --> PPRD
  PPRD --> GPRD
  GPRD --> APRD
  TFP -.-> APRD
  APRD --> DONE

  classDef bpUser fill:#132c4c,stroke:#6b8bb0,stroke-width:2px,color:#e6f1ff
  classDef bpProcess fill:#0e2a4a,stroke:#0078d4,stroke-width:2px,color:#e6f1ff
  classDef bpInfo fill:#004a8f,stroke:#3ca0ff,stroke-width:3px,color:#ffffff
  classDef bpData fill:#06323b,stroke:#50e6ff,stroke-width:2px,color:#d6fbff
  classDef bpDecision fill:#3a2c00,stroke:#ffb900,stroke-width:2px,color:#fff4ce
  classDef bpSuccess fill:#0f2e17,stroke:#6ccb5f,stroke-width:2px,color:#dff6dd
  classDef bpError fill:#3b0f14,stroke:#f1707b,stroke-width:2px,color:#fde7e9
  classDef bpCode stroke-dasharray:0
  class TRG bpUser
  class FMT,SCAN,PDEV,PUAT,PPRD bpProcess
  class ADEV,AUAT,APRD bpInfo
  class TFD,TFU,TFP bpData
  class GUAT,GPRD bpDecision
  class DONE bpSuccess
  class STOP bpError
  class TRG,FMT,SCAN,PDEV,ADEV,PUAT,AUAT,PPRD,APRD,TFD,TFU,TFP bpCode

  style CANVAS fill:#0b1a2e,stroke:#1f3a5f,stroke-width:1px,color:#0b1a2e
  style VAL fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea
  style DEV fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea
  style UAT fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea
  style PRD fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea

  linkStyle default stroke:#3ca0ff,stroke-width:2px
  linkStyle 2 stroke:#f1707b,stroke-width:2px,stroke-dasharray:5 4
  linkStyle 5,9,13 stroke:#50e6ff,stroke-width:1.5px,stroke-dasharray:4 4
```

## Azure DevOps wiki version

The same diagram with the settings line moved below `graph TB` by `scripts/to-ado.mjs`. The wiki shows
"Unsupported diagram type." when a block does not start with the diagram keyword; everything else, icons included,
renders as designed.

::: mermaid
graph TB
%%{init: {"theme":"base","themeVariables":{"fontFamily":"Segoe UI Variable Text, Segoe UI, Helvetica, Arial","fontSize":"15px","primaryColor":"#0e2a4a","primaryBorderColor":"#0078d4","primaryTextColor":"#e6f1ff","textColor":"#e6f1ff","lineColor":"#3ca0ff","titleColor":"#9cc3ea","clusterBkg":"#10243f","clusterBorder":"#24476f","edgeLabelBackground":"#0b1a2e","background":"#0b1a2e"},"themeCSS":".nodeLabel img { display: inline-block !important; width: 18px !important; height: 18px !important; vertical-align: middle; margin: 0 8px 2px 0 !important; } .bpCode .nodeLabel { font-family: Cascadia Code, Cascadia Mono, Consolas, monospace; } .cluster-label .nodeLabel { font-weight: 600; letter-spacing: 0.01em; } .edgeLabel, .edgeLabel p, .edgeLabel span, .labelBkg { background-color: #0b1a2e !important; color: #9cc3ea !important; } .edgeLabel rect { fill: #0b1a2e !important; opacity: 1 !important; }","flowchart":{"curve":"basis","nodeSpacing":36,"rankSpacing":44,"padding":16,"wrappingWidth":280}}}%%
  subgraph CANVAS[" "]
    direction TB
    subgraph VAL["1 · Validate"]
      TRG(["<img src='https://api.iconify.design/devicon/azuredevops.svg' width='18' height='18'/> main · terraform/**"])
      FMT["<img src='https://api.iconify.design/logos/terraform-icon.svg' width='18' height='18'/> fmt + validate"]
      SCAN["<img src='https://api.iconify.design/fluent/shield-task-24-regular.svg?color=%233ca0ff' width='18' height='18'/> tflint + checkov"]
      STOP["<img src='https://api.iconify.design/fluent/dismiss-circle-24-regular.svg?color=%23f1707b' width='18' height='18'/> Fail: stop and notify"]
    end
    subgraph DEV["2 · DEV"]
      PDEV["<img src='https://api.iconify.design/fluent/clipboard-task-list-ltr-24-regular.svg?color=%233ca0ff' width='18' height='18'/> terraform plan"]
      TFD[("<img src='https://api.iconify.design/fluent/document-lock-24-regular.svg?color=%2350e6ff' width='18' height='18'/> tfplan-dev")]
      ADEV["<img src='https://api.iconify.design/fluent/cloud-arrow-up-24-regular.svg?color=%23e6f1ff' width='18' height='18'/> terraform apply"]
    end
    subgraph UAT["3 · UAT"]
      PUAT["<img src='https://api.iconify.design/fluent/clipboard-task-list-ltr-24-regular.svg?color=%233ca0ff' width='18' height='18'/> terraform plan"]
      TFU[("<img src='https://api.iconify.design/fluent/document-lock-24-regular.svg?color=%2350e6ff' width='18' height='18'/> tfplan-uat")]
      GUAT{{"<img src='https://api.iconify.design/fluent/person-available-24-regular.svg?color=%23ffb900' width='18' height='18'/> Approval"}}
      AUAT["<img src='https://api.iconify.design/fluent/cloud-arrow-up-24-regular.svg?color=%23e6f1ff' width='18' height='18'/> terraform apply"]
    end
    subgraph PRD["4 · PROD"]
      PPRD["<img src='https://api.iconify.design/fluent/clipboard-task-list-ltr-24-regular.svg?color=%233ca0ff' width='18' height='18'/> terraform plan"]
      TFP[("<img src='https://api.iconify.design/fluent/document-lock-24-regular.svg?color=%2350e6ff' width='18' height='18'/> tfplan-prod")]
      GPRD{{"<img src='https://api.iconify.design/fluent/calendar-clock-24-regular.svg?color=%23ffb900' width='18' height='18'/> Approval + hours"}}
      APRD["<img src='https://api.iconify.design/fluent/cloud-arrow-up-24-regular.svg?color=%23e6f1ff' width='18' height='18'/> terraform apply"]
    end
    DONE(["<img src='https://api.iconify.design/fluent/checkmark-circle-24-regular.svg?color=%236ccb5f' width='18' height='18'/> Released"])
  end

  TRG --> FMT
  FMT --> SCAN
  SCAN -.-> STOP
  SCAN --> PDEV
  PDEV --> ADEV
  TFD -.-> ADEV
  ADEV --> PUAT
  PUAT --> GUAT
  GUAT --> AUAT
  TFU -.-> AUAT
  AUAT --> PPRD
  PPRD --> GPRD
  GPRD --> APRD
  TFP -.-> APRD
  APRD --> DONE

  classDef bpUser fill:#132c4c,stroke:#6b8bb0,stroke-width:2px,color:#e6f1ff
  classDef bpProcess fill:#0e2a4a,stroke:#0078d4,stroke-width:2px,color:#e6f1ff
  classDef bpInfo fill:#004a8f,stroke:#3ca0ff,stroke-width:3px,color:#ffffff
  classDef bpData fill:#06323b,stroke:#50e6ff,stroke-width:2px,color:#d6fbff
  classDef bpDecision fill:#3a2c00,stroke:#ffb900,stroke-width:2px,color:#fff4ce
  classDef bpSuccess fill:#0f2e17,stroke:#6ccb5f,stroke-width:2px,color:#dff6dd
  classDef bpError fill:#3b0f14,stroke:#f1707b,stroke-width:2px,color:#fde7e9
  classDef bpCode stroke-dasharray:0
  class TRG bpUser
  class FMT,SCAN,PDEV,PUAT,PPRD bpProcess
  class ADEV,AUAT,APRD bpInfo
  class TFD,TFU,TFP bpData
  class GUAT,GPRD bpDecision
  class DONE bpSuccess
  class STOP bpError
  class TRG,FMT,SCAN,PDEV,ADEV,PUAT,AUAT,PPRD,APRD,TFD,TFU,TFP bpCode

  style CANVAS fill:#0b1a2e,stroke:#1f3a5f,stroke-width:1px,color:#0b1a2e
  style VAL fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea
  style DEV fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea
  style UAT fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea
  style PRD fill:#10243f,stroke:#24476f,stroke-width:1px,color:#9cc3ea

  linkStyle default stroke:#3ca0ff,stroke-width:2px
  linkStyle 2 stroke:#f1707b,stroke-width:2px,stroke-dasharray:5 4
  linkStyle 5,9,13 stroke:#50e6ff,stroke-width:1.5px,stroke-dasharray:4 4
:::
