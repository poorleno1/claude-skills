---
name: qa-review
description: QA review of the current branch against a base branch (default development) for a task's acceptance criteria. Finds bugs, regressions, frontend-backend contract mismatches and open questions, verifies each finding against the code, and reports them in a fixed format. Takes the acceptance criteria as arguments, or asks the user for them.
disable-model-invocation: true
argument-hint: "[--base <branch>] [acceptance criteria]"
allowed-tools: Bash, Read, Write, Grep, Glob, Agent
---

# QA review

## Step 1: Get the base branch and the acceptance criteria

Parse `$ARGUMENTS`:
- `--base <branch>`: the base branch. Default `development`.
- Everything else: the acceptance criteria for the task under test.

If no acceptance criteria were given, ask the user to paste them, then stop and wait for their reply. The whole analysis is framed around them, so don't start reading the diff or the code before you have them.

## Step 2: Review

You are a senior QA engineer. You've been assigned the task with the acceptance criteria above for testing.

Treat `origin/<base-branch>` as the baseline.

## Your goal
Analyze the task and the code changes, then identify:
1. Bugs that are present in the implementation.
2. Issues worth raising with the team (gaps in requirements, unclear logic, risky decisions).
3. Regressions: which functionality that works correctly on the base branch may be broken by these changes.

Go beyond the technical level and think about the business logic: does the implementation actually deliver what the business needs? Are there scenarios the acceptance criteria don't cover but real users will hit?

## Verification rules
Before including any bug in your answer, check it against the code.
- If the code clearly confirms the bug, mark it as **Confirmed**.
- If it depends on something you can't see (config, other services, data, environment), mark it as **Needs verification** and state exactly what needs to be checked.
- Do not report speculative issues as confirmed bugs.

Also trace the changes to the places that depend on them (shared components, APIs, DB tables, utilities) and check whether anything could break there.

## Frontend–backend integration
Check that the frontend and backend work together correctly:
- The API contracts match on both sides: endpoints, HTTP methods, field names, data types, required vs optional fields, nullability, enum values, and date/number formats.
- Every field the frontend sends is accepted and processed by the backend, and every field the backend returns is handled by the frontend (displayed, stored, or intentionally ignored).
- No field is silently dropped, renamed on one side only, or sent with a mismatched type.
- Backend errors and validation messages are handled on the UI, and the user sees a meaningful result.

## Analysis principles
Apply the techniques below wherever they are relevant to the task. Don't force a technique where it doesn't fit.

**Test design techniques**
- **Boundary Value Analysis:** for numeric, length, date and time parameters (min, min−1, max, max+1, zero, empty).
- **Equivalence Partitioning:** split input data into valid and invalid classes and test a representative of each.
- **Decision Table Testing:** for business rules with several conditions that combine to produce different outcomes.
- **State Transition Testing:** for entities with statuses or lifecycles. Check valid transitions, and make sure invalid ones are blocked.
- **Pairwise Testing:** when there are many parameters or settings that can be combined, cover all pairs of values instead of every combination.
- **Cause–Effect Analysis:** trace which inputs and conditions lead to which system reactions.
- **Use Case / User Scenario Testing:** walk through end-to-end user flows, not just individual functions.
- **Error Guessing:** use experience to predict typical mistakes: null/undefined, empty strings, whitespace, special characters, Unicode, very long values, duplicates, timezone issues, rounding errors.

**Test analysis approaches**
- **Happy Path + Negative Cases + Edge Cases:** cover all three for every changed behavior.
- **Risk-Based Testing:** prioritize areas with the highest business impact and the highest likelihood of failure.
- **Impact Analysis:** determine which modules, screens and integrations are affected by the changes, directly or indirectly.
- **CRUD Analysis:** for any data entity, check create, read, update and delete, including how each operation affects related data.
- **Data Flow Analysis:** follow the data from UI input through API and business logic to the DB and back, checking transformations at every step.
- **Permissions and Roles:** check behavior for different user roles and for users without access.
- **Idempotency:** check that repeated requests (double click, retry, page refresh) don't create duplicates or corrupt data, especially for API calls and DB operations.
- **Concurrency and Race Conditions:** for async changes, check parallel requests, simultaneous edits of the same data, and out-of-order responses.
- **Backward Compatibility:** check that existing data, old clients and saved states still work after the changes.

## Output format
For each bug, use this structure:

**Bug #N: [short title]**
- **Status:** Confirmed / Needs verification
- **Severity:** Critical / Major / Minor
- **Technique:** which technique or approach revealed it
- **Why it's a bug:** what's wrong and which requirement or expected behavior it violates
- **Code reference:** file and line/function where the problem is
- **Steps to reproduce (UI):** numbered steps a user would take in the interface
- **Expected result:**
- **Actual result:**
- **Breaks existing functionality:** Yes / No. If yes, what works on the base branch and breaks with these changes

After the bug list, add:
- **Contract mismatches:** a list of fields or endpoints where frontend and backend disagree
- **Regression risks:** areas that should be retested and why
- **Questions for the team:** unclear requirements or decisions that need clarification
