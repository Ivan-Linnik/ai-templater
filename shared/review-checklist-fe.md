# Frontend Review Checklist

This checklist describes what should be checked during frontend code review.
It does not define review scope, severity levels, or agent behavior.

---

## Goal

Review code for:
- correctness
- regression risk
- maintainability
- consistency with local project patterns

Prioritize issues that can break behavior, increase risk, or make future support harder.

---

## Primary Rule

Check correctness and risk first.

Do not focus on style or minor cleanup if there are more important problems in the change.

---

## Review Order

Check the change in this order:

1. correctness
2. regression risk
3. consistency with local patterns
4. maintainability
5. style and readability

---

## Correctness

Check:
- does the code do what the change intends to do
- are conditions correct
- are edge cases handled
- is null / undefined handling safe
- are loading / error / empty states handled where needed
- are side effects placed in the correct lifecycle or handler
- are async flows handled safely
- are values derived from the correct source of truth

Pay extra attention to:
- changed conditions
- changed reactive dependencies
- derived flags
- form logic
- disabled / hidden UI states
- optimistic assumptions in UI

---

## Regression Risk

Check:
- can the change break existing flows
- does it change shared behavior indirectly
- does it affect app initialization, routing, or provider setup
- does it affect state shape or state ownership
- can it break layout, interaction states, or responsive behavior
- can it break accessibility, keyboard behavior, or focus handling

Pay extra attention to:
- app entry points
- shared utilities and hooks
- reused components
- state updates
- route-dependent logic
- conditional rendering changes

---

## Local Consistency

Check:
- does the change follow the pattern already used in the target area
- does it match local state management approach
- does it match local styling approach
- does it keep naming and structure consistent with nearby code
- does it avoid introducing unrelated abstractions

Do not require a different architecture only because it looks cleaner in isolation.

Prefer consistency with the local module unless the current pattern is clearly broken.

---

## Maintainability

Check:
- is the code easy to understand
- are names clear
- is branching readable
- is rendering logic too dense
- is the logic split at the right level
- is duplication acceptable or already growing into noise
- are comments useful and accurate
- is the code easy to modify without breaking neighboring logic

Prefer small, understandable code over clever compact code.

---

## Style and Readability

Check:
- does the code follow established TypeScript style rules
- do styles follow established CSS rules
- are imports grouped and ordered correctly
- are comments meaningful and necessary
- are expressions readable
- are nested conditions or ternaries making the code harder to scan

Style issues matter, but they are secondary to correctness and risk.

---

## State Management Changes

Check carefully when the change touches application or component state.

Questions:
- does the change preserve the local state ownership model
- is state updated in the correct place
- does derived state duplicate existing source of truth
- is there hidden coupling between local state and shared state
- does the change mix patterns that should stay separate

Pay extra attention in mixed or legacy areas.

---

## Forms and User Interaction

Check:
- are controlled / uncontrolled patterns used consistently
- are validation and submission states handled correctly
- are disabled states justified
- can users reach the expected action
- are loading states, retries, and errors visible when needed
- can interaction logic get stuck in an invalid or incomplete state

---

## Styling and Layout

Check:
- does styling rely on fragile structure
- is selector specificity unnecessarily high
- are overrides piling up instead of fixing ownership
- are responsive changes safe
- are visual states kept close to base styles
- does the change introduce styling that will be hard to extend later

---

## Comments

Check:
- do comments explain a real constraint or non-obvious decision
- are TODOs specific and useful
- are comments still accurate after the change
- do comments repeat obvious code instead of adding context

Prefer improving code clarity over adding weak comments.

---

## Imports

Check:
- are import groups separated clearly
- are external, internal, and relative imports grouped consistently
- are side-effect imports kept in safe order
- are unused imports left behind
- are deep relative imports making the file harder to navigate

Preserve execution-sensitive import order where needed.

---

## Red Flags

Treat these as strong review signals:
- changed behavior hidden inside refactor-like cleanup
- broad scope without clear need
- state ownership becoming unclear
- duplicate source of truth
- fragile conditional rendering
- styling that depends on DOM structure coincidence
- reactive dependencies that are unclear or stale
- comments that no longer match the code
- abstractions introduced too early
- unrelated file churn

---

## Review Notes

When leaving review comments:
- prefer concrete observations over general opinions
- explain why the issue matters
- give local, actionable feedback
- avoid requesting broad rewrites unless they are necessary

Focus on the highest-value findings first.
