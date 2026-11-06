# Template: simple table

The lighter table style. Same dark card and header as the detailed table; no chips or pills. The first column is
white and semi-bold, the name column is cyan Cascadia Code, the last column is plain prose.

Use for inventories and catalogues: services, resources, variables, anything with a name and a description.

<div style="overflow-x:auto;max-width:100%">
<table style="border-collapse:separate;border-spacing:0;width:1040px;font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#e6f1ff">
<thead>
<tr><th scope="col" style="background:#0e2a4a;color:#9cc3ea;text-align:left;padding:13px 18px;font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;border-bottom:3px solid #3ca0ff;width:96px;box-sizing:border-box;border-top:1px solid #1f3a5f;border-left:1px solid #1f3a5f">Service</th><th scope="col" style="background:#0e2a4a;color:#9cc3ea;text-align:left;padding:13px 18px;font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;border-bottom:3px solid #3ca0ff;width:139px;box-sizing:border-box;border-top:1px solid #1f3a5f">Name</th><th scope="col" style="background:#0e2a4a;color:#9cc3ea;text-align:left;padding:13px 18px;font-family:'Segoe UI Variable Text','Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;border-bottom:3px solid #3ca0ff;width:805px;box-sizing:border-box;border-top:1px solid #1f3a5f;border-right:1px solid #1f3a5f">Purpose</th></tr>
</thead>
<tbody>
<tr><td style="padding:13px 18px;vertical-align:top;background:#0b1a2e;font-weight:600;box-sizing:border-box;border-left:1px solid #1f3a5f"><img src="https://api.iconify.design/fluent/window-24-regular.svg?color=%233ca0ff" width="18" height="18" alt="" style="vertical-align:-4px;margin-right:10px">App Service</td><td style="padding:13px 18px;vertical-align:top;background:#0b1a2e;font-family:'Cascadia Code','Cascadia Mono',Consolas,monospace;font-size:13.5px;color:#50e6ff;box-sizing:border-box">app-web-myapp-prod</td><td style="padding:13px 18px;vertical-align:top;background:#0b1a2e;box-sizing:border-box;border-right:1px solid #1f3a5f">Hosts the customer web front end. Scales out to four instances during business hours and back to two overnight.</td></tr>
<tr><td style="padding:13px 18px;vertical-align:top;background:#10243f;border-top:1px solid #1f3a5f;font-weight:600;box-sizing:border-box;border-left:1px solid #1f3a5f"><img src="https://api.iconify.design/fluent/key-24-regular.svg?color=%2350e6ff" width="18" height="18" alt="" style="vertical-align:-4px;margin-right:10px">Key Vault</td><td style="padding:13px 18px;vertical-align:top;background:#10243f;border-top:1px solid #1f3a5f;font-family:'Cascadia Code','Cascadia Mono',Consolas,monospace;font-size:13.5px;color:#50e6ff;box-sizing:border-box">kv-myapp-prod</td><td style="padding:13px 18px;vertical-align:top;background:#10243f;border-top:1px solid #1f3a5f;box-sizing:border-box;border-right:1px solid #1f3a5f">Holds connection strings and the TLS certificate. The web app reads secrets through its managed identity; nobody reads them by hand.</td></tr>
<tr><td style="padding:13px 18px;vertical-align:top;background:#0b1a2e;border-top:1px solid #1f3a5f;font-weight:600;box-sizing:border-box;border-left:1px solid #1f3a5f"><img src="https://api.iconify.design/devicon/azuresqldatabase.svg" width="18" height="18" alt="" style="vertical-align:-4px;margin-right:10px">Azure SQL</td><td style="padding:13px 18px;vertical-align:top;background:#0b1a2e;border-top:1px solid #1f3a5f;font-family:'Cascadia Code','Cascadia Mono',Consolas,monospace;font-size:13.5px;color:#50e6ff;box-sizing:border-box">sqldb-myapp-prod</td><td style="padding:13px 18px;vertical-align:top;background:#0b1a2e;border-top:1px solid #1f3a5f;box-sizing:border-box;border-right:1px solid #1f3a5f">Orders and customer data. Geo-replicated to North Europe with automatic failover.</td></tr>
<tr><td style="padding:13px 18px;vertical-align:top;background:#10243f;border-top:1px solid #1f3a5f;font-weight:600;box-sizing:border-box;border-left:1px solid #1f3a5f;border-bottom:1px solid #1f3a5f"><img src="https://api.iconify.design/fluent/data-trending-24-regular.svg?color=%233ca0ff" width="18" height="18" alt="" style="vertical-align:-4px;margin-right:10px">Log Analytics</td><td style="padding:13px 18px;vertical-align:top;background:#10243f;border-top:1px solid #1f3a5f;font-family:'Cascadia Code','Cascadia Mono',Consolas,monospace;font-size:13.5px;color:#50e6ff;box-sizing:border-box;border-bottom:1px solid #1f3a5f">log-shared-prod</td><td style="padding:13px 18px;vertical-align:top;background:#10243f;border-top:1px solid #1f3a5f;box-sizing:border-box;border-right:1px solid #1f3a5f;border-bottom:1px solid #1f3a5f">Central log store shared by all production workloads. Retention is 90 days.</td></tr>
</tbody>
</table>
</div>

Plain Markdown fallback (for GitHub, which strips the styling):

| Service | Name | Purpose |
|---|---|---|
| App Service | `app-web-myapp-prod` | Hosts the customer web front end. Scales out to four instances during business hours and back to two overnight. |
| Key Vault | `kv-myapp-prod` | Holds connection strings and the TLS certificate. The web app reads secrets through its managed identity; nobody reads them by hand. |
| Azure SQL | `sqldb-myapp-prod` | Orders and customer data. Geo-replicated to North Europe with automatic failover. |
| Log Analytics | `log-shared-prod` | Central log store shared by all production workloads. Retention is 90 days. |
