# Icons

Icons are for the `web` target (GitHub, VS Code preview, mermaid.live, docs sites). Leave them out for the
Azure DevOps wiki until they are confirmed to render there.

## How

Put a small `<img>` at the start of the node label. The image comes from the Iconify API:

```text
PDEV["<img src='https://api.iconify.design/fluent/clipboard-task-list-ltr-24-regular.svg?color=%233ca0ff' width='18' height='18'/> terraform plan"]
```

- URL pattern: `https://api.iconify.design/<prefix>/<name>.svg`. The catalog below uses `prefix:name`; swap the colon for a slash.
- Single-colour icons (`fluent:`) take a tint: append `?color=%23<hex>` (`%23` is an encoded `#`). Use the role colour from the tables below.
- Brand logos (`logos:`, `devicon:`, `vscode-icons:`) keep their own colours. Do not tint them.
- Always write `width='18' height='18'` and single quotes inside the label. The size lets Mermaid size the box before the image loads.
- The `.nodeLabel img` rule in the init block's `themeCSS` places the icon left of the text. Keep it.
- Use a brand logo once, where that product enters the flow. Use Fluent icons for everything else so the diagram stays calm.

## Why not the other icon syntaxes

| Syntax | Problem in Markdown |
|---|---|
| `@{ icon: "pack:name" }` | Needs icon packs registered by the host page. GitHub, VS Code and Azure DevOps do not do that |
| `@{ img: "url" }` | Needs Mermaid 11.3 or later, draws a light label bar that breaks the dark theme, drops the node colour |
| `fa:fa-name` | Needs FontAwesome loaded by the host page; unsupported in Azure DevOps |

## Limits

- Icons load from api.iconify.design when the diagram is viewed. Offline readers see an empty square.
- The public API rate-limits heavy use (HTTP 429). Normal page views are fine; bulk rendering in scripts can hit it.
- Iconify has no official Azure service icons (Key Vault, App Service and so on). The Fluent icons below stand in.
  Microsoft's official Azure architecture icons are a free download; to use them, host the SVG files where the
  diagram can reach them and point `src` at that URL.
- To find other icons: `https://api.iconify.design/search?query=<word>&prefixes=fluent,logos,devicon,vscode-icons`.
  Check a name exists with `https://api.iconify.design/<prefix>/<name>.svg` before using it.

## Catalog

All names below were checked against the Iconify API. Tint names refer to the palette: process `#3ca0ff`,
data `#50e6ff`, decision `#ffb900`, success `#6ccb5f`, error `#f1707b`, neutral `#e6f1ff`.

### Platforms and tools

Brand logos in their own colours. Use once per diagram, where the product enters the flow.

| Use for | Icon | Tint | Example |
|---|---|---|---|
| Azure | `devicon:azure` | brand | Cloud boundary, subscription |
| Azure DevOps | `devicon:azuredevops` | brand | Pipeline trigger, project |
| Azure Pipelines | `vscode-icons:file-type-azurepipelines` | brand | Pipeline definition (YAML) |
| Terraform | `logos:terraform-icon` | brand | Terraform step or module |
| Bicep | `vscode-icons:file-type-bicep` | brand | Bicep template |
| PowerShell | `devicon:powershell` | brand | Script step |
| Kubernetes / AKS | `devicon:kubernetes` | brand | Cluster |
| Docker / ACR | `devicon:docker` | brand | Container image, registry |
| Cosmos DB | `devicon:cosmosdb` | brand | Cosmos DB account |
| Azure SQL | `devicon:azuresqldatabase` | brand | SQL database |

### Azure services

Iconify has no official Azure service icons, so these single-colour Fluent icons stand in, tinted by role.

| Use for | Icon | Tint | Example |
|---|---|---|---|
| Key Vault | `fluent:key-24-regular` | data | Secrets, certificates |
| Entra ID / identity | `fluent:shield-lock-24-regular` | process | Tenant, managed identity, RBAC |
| Storage account | `fluent:hard-drive-24-regular` | data | Blob, tfstate backend |
| Database (generic) | `fluent:database-24-regular` | data | Any data store |
| App Service | `fluent:window-24-regular` | process | Web app, API |
| Function App | `fluent:flash-24-regular` | process | Serverless function |
| Virtual machine | `fluent:server-24-regular` | process | VM, agent pool |
| Virtual network | `fluent:virtual-network-20-regular` | process | VNet, subnet, peering |
| Router / gateway | `fluent:router-24-regular` | process | VPN, NAT, App Gateway |
| Public endpoint | `fluent:globe-24-regular` | neutral | Internet, Front Door, DNS |
| Monitor | `fluent:data-trending-24-regular` | process | Log Analytics, App Insights |
| Resource group | `fluent:box-24-regular` | neutral | Resource group, package |
| Service connection | `fluent:plug-connected-24-regular` | neutral | ADO service connection, OIDC |
| Tags / policy | `fluent:tag-24-regular` | neutral | Tags, Azure Policy |

### Pipeline steps

Tinted blue for work, cyan for artifacts.

| Use for | Icon | Tint | Example |
|---|---|---|---|
| Branch / trigger | `fluent:branch-24-regular` | process | Branch, PR trigger |
| Plan | `fluent:clipboard-task-list-ltr-24-regular` | process | terraform plan, what-if |
| Apply / deploy | `fluent:cloud-arrow-up-24-regular` | neutral | terraform apply, deploy |
| Saved plan / artifact | `fluent:document-lock-24-regular` | data | tfplan, pipeline artifact |
| Scan / lint | `fluent:shield-task-24-regular` | process | tflint, checkov, Defender |
| Test | `fluent:beaker-24-regular` | process | Terratest, Pester |
| Script | `fluent:window-console-20-regular` | process | Inline script, CLI |
| Code | `fluent:code-24-regular` | process | Repository, source |
| Sync / drift | `fluent:arrow-sync-24-regular` | process | Drift detection, refresh |
| Release | `fluent:rocket-24-regular` | success | Release, go-live |
| Schedule | `fluent:timer-24-regular` | neutral | Scheduled trigger |
| Archive / backup | `fluent:archive-24-regular` | data | Backup, retention |

### Gates, people and status

Amber for human decisions, green and red for outcomes.

| Use for | Icon | Tint | Example |
|---|---|---|---|
| Approval | `fluent:person-available-24-regular` | decision | Manual approval check |
| Business hours | `fluent:calendar-clock-24-regular` | decision | Time-window check |
| User | `fluent:person-24-regular` | neutral | Actor, operator |
| Team | `fluent:people-team-24-regular` | neutral | Team, group |
| Success | `fluent:checkmark-circle-24-regular` | success | Released, passed |
| Failure | `fluent:dismiss-circle-24-regular` | error | Failed, blocked |
| Warning | `fluent:warning-24-regular` | decision | Degraded, caution |
| Alert | `fluent:alert-24-regular` | error | Alert rule, page |
| Notify | `fluent:mail-24-regular` | neutral | Email, Teams message |
| Lock | `fluent:lock-closed-24-regular` | neutral | State lock, private access |

