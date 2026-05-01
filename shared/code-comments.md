# Comments Rules

Apply these rules when adding, editing, or reviewing comments in frontend code.

These rules are for executable agent behavior, not for human learning materials.

---

## Goal

Use comments only when they reduce maintenance risk, prevent incorrect refactoring, or clarify a non-obvious constraint.

A comment must add information that is not already obvious from the code itself.

---

## Primary Rule

Prefer self-explanatory code over comments.

Add or keep a comment only if it explains at least one of:
- why this implementation exists
- what constraint prevents a simpler implementation
- what can break if the code is changed
- when the workaround or compromise should be removed

If a comment does not do one of these, treat it as noise.

---

## Allowed Comment Types

### 1. Constraint comments
Use when the code is shaped by a real limitation.

Examples of valid reasons:
- legacy dependency
- external API contract
- browser/platform quirk
- design-system gap
- third-party library limitation

### 2. Invariant / risk comments
Use when changing the code can silently break behavior.

Examples:
- hook call order matters
- dependency list is intentionally incomplete
- value must stay in sync with another field
- a function depends on side effects outside the local file

### 3. Removal-trigger comments
Use when temporary code must be revisited later.

The comment must say:
- what is temporary
- why it is temporary
- when it should be removed or revisited

### 4. JSDoc for public contracts
Use JSDoc only for exported/public entities when TypeScript types are not enough to explain:
- semantics
- usage contract
- controlled/uncontrolled behavior
- important invariants
- non-obvious defaults
- side effects or limitations

This most often applies to:
- exported components
- exported hooks
- exported types/interfaces used across modules

---

## Forbidden Comment Types

Do not add or keep comments that:
- restate obvious code behavior
- describe syntax instead of intent
- explain trivial assignments or conditions
- say "TODO later" without reason
- say what the code does when the name/signature already makes it obvious
- create local documentation noise inside simple implementation code

Examples of bad comments:
- `// increment i`
- `// render button`
- `// check condition`
- `// TODO fix this`
- `/** user id */` for a field already clearly named `userId: string`

---

## TODO Rules

Use TODO only for an intentional compromise, known defect, or postponed fix.

A valid TODO should contain:
1. what is wrong or incomplete
2. why it is left this way now
3. when to return to it
4. optional risk if it stays unchanged

Preferred format:
- `TODO(TICKET-ID): short problem. Reason/constraint. Return trigger.`

Good:
- `TODO(FNS-1234): hook order is fragile here because the form controller depends on stable registration order. Revisit after form engine cleanup.`

Acceptable without ticket only if no tracker exists:
- `TODO: design system has no token for accent text yet. Replace after token is added.`

Bad:
- `TODO: refactor`
- `TODO: fix later`
- `TODO: improve this`

---

## JSDoc Rules

Use JSDoc only where it improves the usage contract for other developers or tools.

### Use JSDoc for exported/public entities when needed
Examples:
- component behavior is not obvious from props alone
- a type has semantic meaning not captured by TS
- a prop must match another structure or invariant
- a hook has important side effects or lifecycle expectations

### Do not use JSDoc when TypeScript already says enough
Avoid documenting:
- obvious primitive fields
- trivial local helpers
- simple internal functions
- local variables

### JSDoc should explain:
- purpose
- contract
- important behavior
- constraints
- examples only when they reduce ambiguity

Keep it concise.

---

## Editing Rules

When modifying existing comments:

### Keep the comment if it still protects intent
Preserve comments that explain:
- legacy constraints
- external contracts
- non-obvious behavior
- intentional rule exceptions

### Rewrite the comment if the intent is valid but wording is weak
Shorten it.
Make it concrete.
Remove narrative tone.

### Remove the comment if it became noise
Delete comments that:
- duplicate code
- describe obsolete behavior
- no longer match implementation
- explain something now visible from naming or types

### Update TODOs when context changed
If the reason or trigger changed, update the TODO instead of leaving stale context.

---

## Linter / Rule Suppression Comments

If a suppression comment is required, it must explain why the rule is intentionally bypassed.

Good:
- `// dep2 changes semantics here; effect must react only to dep1`
- `// eslint-disable-next-line react-hooks/exhaustive-deps`

Bad:
- `// eslint-disable-next-line`
- `// ignore lint`

Never leave rule suppression without a reason unless the reason is fully obvious from the next line and local context.

---

## Scope Rules for Agents

When acting as an editing agent:
- apply comment changes only in files affected by the current task
- do not scan the whole repository for comment cleanup unless explicitly asked
- do not rewrite comments as part of unrelated architecture or refactoring work
- do not add comments to every non-trivial block by default

Comments are exceptions, not decoration.

---

## Review Rules for Agents

When reviewing code:
- flag comments that are misleading, stale, or noisy
- do not request comments for obvious code
- request a comment only where future misuse is likely without context
- prefer a stronger name or simpler code over adding a weak comment

---

## Safe Default

If unsure whether a comment is needed:
- first try to improve naming or structure
- if the risk still remains non-obvious, add a concise comment
- otherwise do not comment