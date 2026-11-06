# claude-skills

## Purpose

Keeps my personal Claude Code skills in one place so every computer gets the same set. The repo is a
plugin marketplace (`js-skills`) with one plugin (`js`).

| Skill | Invoke | What it does |
| --- | --- | --- |
| `mermaid-azure-midnight` | automatic, or `/js:mermaid-azure-midnight` | Azure Midnight style for Mermaid diagrams, tables and code blocks |
| `qa-review` | `/js:qa-review [--base <branch>] [criteria]` | QA review of the current branch against acceptance criteria |
| `review-branch` | `/js:review-branch [base-branch]` | PR-readiness review of the current branch |
| `ticket` | `/js:ticket <ticket URL>` | Ticket to worktree, agent, PR and reviews in a Herdr tab |

## Prerequisites

- Claude Code signed in with a claude.ai account (for account sync), or the `/plugin` command.
- Node.js, for the `mermaid-azure-midnight` check scripts.
- Herdr, for the `ticket` skill.

## Setup

Use one of these:

- **claude.ai sync:** add this GitHub repo as a plugin marketplace on claude.ai. Every signed-in
  Claude Code then loads the plugin from `~/.claude/plugins/synced/`.
- **Per computer:** in Claude Code run

  ```text
  /plugin marketplace add poorleno1/claude-skills
  /plugin install js@js-skills
  ```

`mermaid-azure-midnight` needs its browser-check dependencies once per installed copy: run
`npm install` in the skill's `scripts/` folder. A plugin update replaces that folder, so run it again
after an update.

## Usage

Edit a skill here, bump `version` in `plugins/js/.claude-plugin/plugin.json`, commit and push. Synced
computers pick it up on the next sync; per-computer installs with `/plugin marketplace update js-skills`.

## Configuration

- Plugin name `js` is the skill prefix (`/js:<skill>`).
- Do not keep a copy of the same skill in `~/.claude/skills/`, or it shows up twice.
- No secrets belong in this repo; it is public.
