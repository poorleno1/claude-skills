---
name: review-branch
description: Review the current branch against development for PR readiness. Performs comprehensive code review covering best practices, impact analysis, and data safety. Outputs a markdown report.
disable-model-invocation: true
argument-hint: [base-branch]
allowed-tools: Bash, Read, Write, Grep, Glob, Agent
---

# Branch Review

- Review the currently checked out branch against the base origin branch for PR readiness.
- Use `$ARGUMENTS` as the base branch if provided, otherwise default to `development`.
- Before performing the review, make sure that the checked out branch is ahead of the base origin branch.
- If it is not, offer to rebase.
    - If user declines, end review.
    - If user accepts and there are conflicts, end review
    - If user accepts and there are no conflicts, rebase current branch on top of origin base branch

## Excluded Paths

Skip the following paths entirely — they contain test data files (binaries, XML fixtures, etc.) that are version-controlled but not meaningful to review:

- `src/backend/Tests/Ipos.Api.Tests/IntegrationTests/TestFiles/**`
- `src/backend/Tests/Ipos.Biz.Tests/TestFiles/**`

When gathering the diff, exclude these paths:
`git diff development...HEAD -- ":(exclude)src/backend/Tests/Ipos.Api.Tests/IntegrationTests/TestFiles" ":(exclude)src/backend/Tests/Ipos.Biz.Tests/TestFiles"`

## Review Process

1. **Gather changes**: Run `git diff $base_branch...HEAD` (or the specified base branch) excluding the paths listed above. Also run `git diff $base_branch...HEAD --name-only` with the same exclusions to get the list of changed files.

2. **Read changed files**: For each changed file, read the full file to understand the surrounding context — not just the diff hunks. This is critical for catching issues that depend on how the change interacts with existing code.

3. Perform ALL three review parts below. Use agents for deeper research where noted.

## IMPORTANT: Scope constraint 
 - ALL findings in Part 1 (Best Practices) MUST be about code in the changed files only. Do not report issues in files that are not in the changed file list. 
 - Part 2 (Impact Analysis) may reference other files to assess blast radius, but findings should describe the risk the *change* introduces to those dependents — not pre-existing issues in the dependent code. 
 - Part 3 (Data) follows the same rule: only flag data risks introduced by the changes on this branch.
 - Reference all files with full paths relative to the repo root.
 - Do not comment on changes that are already following best practices or do not introduce any issues.

### Finding bar (applies to all parts)

 - Every finding must name a concrete trigger: a specific input, call path, or data/state reachable from the changed code that produces the problem. If you cannot name one, it is speculation — do not report it.
 - This repo's CLAUDE.md prioritizes simplicity. Do NOT suggest defensive code, fallbacks, extra error handling, or new tests for failure modes not reachable from the diff. A "fix" that adds speculative robustness is itself a defect; flag unnecessary complexity in the change instead.
 - The checklists below are lenses, not boxes to fill. Most categories will have zero findings on a typical change — that is the expected, correct outcome. Do not manufacture a finding to populate a category.

---

## PART 1: Best Practices Review

Check every changed file for:

### Correctness
- Logic errors, off-by-one errors, null/undefined handling
- Missing handling for inputs/states the changed code can actually receive — not hypothetical ones
- Race conditions or concurrency issues
- Incorrect use of APIs or libraries

### Security
- SQL injection, XSS, command injection
- Hardcoded secrets or credentials
- Improper authentication/authorization checks
- Sensitive data exposure in logs or responses
- Input validation gaps

### Performance
- N+1 queries, unnecessary database calls
- Missing indexes for new query patterns
- Memory leaks or excessive allocations
- Expensive operations in loops
- Inefficient algorithms or data structures

### Readability & Maintainability
- Dead code, unused imports, commented-out code
- Inconsistent naming or style relative to the codebase
- Code duplication
- Missing or misleading comments on complex logic
- Overly complex code that could be simplified

### Error Handling
- Swallowed exceptions, missing try/catch
- Unhelpful error messages
- Unhandled edge cases that are actually reachable

### Testing
- Missing tests for new/changed *non-trivial* behavior that is currently untested — not "more tests would help"
- Broken existing tests
- Tests that don't assert meaningful outcomes
- Flaky test patterns (timing, order dependence)
- Edge cases not covered

### Architecture
- SOLID violations, tight coupling, misplaced responsibilities
- Breaking existing patterns in the codebase
- Dependency issues

### API & Contract Changes
- Breaking changes to endpoints or models
- Missing migrations
- Backward compatibility issues

---

## PART 2: Impact Analysis

Determine the blast radius of every change. Only trace impact when a change touches **public surface** — exported signatures, DTOs/contracts, database entities, or shared frontend code. Skip impact tracing for changes internal to a single file/method that do not alter any externally visible behavior. For each qualifying file, spawn an agent to trace its dependents and consumers:

- **Backend services/repositories**: If a service, repository, helper, or shared backend class is changed — find ALL controllers, other services, background jobs, and integrations that call or depend on it. Check if the change alters behavior, signatures, return types, or side effects that could break callers.
- **Frontend shared code**: If a shared component, helper, hook, translation key, or anything in a shared/lib folder is changed — trace ALL features and pages that import or use it. Check if prop changes, behavioral changes, or removed exports could cause regressions.
- **DTOs / API contracts**: If a DTO, request model, or response model is changed — trace both the backend endpoints that use it AND the frontend code that consumes it. Flag any mismatch.
- **Database entities / mappings**: If an entity or EF configuration is changed — identify all queries, services, and features that read or write that entity.
- **Database transaction nesting**: If a database transaction was added to a service and it does not check if a transaction has already been started upstream, mark it as a critical issue if (and only if) there is another method calling this service inside a database transaction.

For each impacted area, report:
- What was changed
- What depends on it (list the specific files/features)
- Whether the dependents are compatible with the change or need updates
- Risk level: **High** / **Medium** / **Low**

---

## PART 3: Data Impact Analysis

Analyze whether the changes can affect existing data in the database or blob storage:

- **Schema changes**: New columns without defaults on existing tables, removed columns, type changes, constraint changes — can these cause failures for existing rows?
- **Migration safety**: Will migrations lock tables? Are they reversible? Could they timeout on large tables?
- **Data consistency**: Do code changes alter how data is written, updated, or deleted? Could this create nulls, orphaned records, broken foreign keys, or inconsistent state in existing data?
- **Blob storage**: If file upload/download/path logic is changed — could existing stored files become inaccessible or overwritten?
- **Data loss risk**: Any DELETE operations, TRUNCATE, column drops, or overwrites that could permanently destroy data.
- **Seed data / defaults**: Changes to default values or seed data that could conflict with existing records.

For each data risk found, report:
- What the risk is
- Which table(s) / blob container(s) are affected
- Severity: **Critical** / **Warning** / **Info**
- Mitigation recommendation

---

## Classification

Classify each finding by:

**Severity:**
- **Critical**: Bugs, security vulnerabilities, data loss risks — must fix before merge
- **Warning**: Performance issues, maintainability concerns, missing tests, risky impacts — should fix
- **Suggestion**: Changes that *reduce* code or complexity (remove dead code, simplify, delete redundancy). Do not raise suggestions that add code, abstraction, or configuration for its own sake.

**Category:**
- **Best Practice** (from Part 1)
- **Impact** (from Part 2)
- **Data** (from Part 3)

---

## Output Format

1. Create the `reviews/` directory at the repo root if it does not exist.
2. Write the report as a markdown file to `reviews/<branch-name>_<date>.md` where `<date>` is the current date/time formatted as `yyyy-MM-dd_HH-mm`.
3. Do NOT stage or commit the report file. If `reviews/` is not in `.gitignore`, run `git reset HEAD reviews/` after writing to ensure it stays untracked.
4. Also output the full report to the conversation.

### Header
```
# Branch Review: `<branch-name>` vs `<base-branch>`
**Date:** YYYY-MM-DD HH:MM
**Files changed:** N | **Commits:** N | **Lines:** +N / -N
```

### Findings (sorted by severity: Critical first, then Warning, then Suggestion)

Number each finding sequentially starting from 1. For each finding:
```
### <number>. [SEVERITY] <short title>
**Category:** Best Practice / Impact / Data
**File:** `<full-path-from-repo-root>:<line-number>`

**What:** One-sentence description of the issue.

**Why:** Why this is a problem (impact, risk).

**Fix:** Concrete suggestion for how to resolve it, make sure these fixes will not raise issues on follow up reviews. Keep the fix minimal — the smallest change that resolves the issue. Do not propose new abstractions, config, or defensive code.
```

Use these severity labels:
- `[CRITICAL]`
- `[WARNING]`
- `[SUGGESTION]`

### Impacted Features/Domains

List all features, domains, and areas of the application that are touched or affected by these changes.

### Summary Table

```
## Summary

| Category | Critical | Warning | Suggestion |
|----------|----------|---------|------------|
| Best Practice | N | N | N |
| Impact | N | N | N |
| Data | N | N | N |
| **Total** | **N** | **N** | **N** |

**Verdict:** <READY FOR REVIEW / NEEDS CHANGES / BLOCKED>
```

Verdict rules:
- **BLOCKED**: Any critical findings
- **NEEDS CHANGES**: Warnings present but no criticals
- **READY FOR REVIEW**: Only suggestions or no findings

If there are no findings at all, say so and confirm the branch looks good.