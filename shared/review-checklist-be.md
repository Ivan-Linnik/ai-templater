# Backend Review Checklist

This checklist describes what should be checked during backend code review.
It does not define review scope, severity levels, or agent behavior.

---

## Goal

Review code for:
- correctness
- data integrity
- security
- regression risk
- maintainability
- consistency with local project patterns

Prioritize issues that can break behavior, corrupt data, expose vulnerabilities, or make future support harder.

---

## Primary Rule

Check correctness and data integrity first.

Do not focus on style or minor cleanup if there are more important problems in the change.

---

## Review Order

Check the change in this order:

1. correctness
2. data integrity
3. security
4. regression risk
5. consistency with local patterns
6. maintainability
7. style and readability

---

## Correctness

Check:
- does the code do what the change intends to do
- are conditions correct
- are edge cases handled
- is null / empty / unexpected input handling safe
- are error states handled and propagated correctly
- are async flows handled safely
- are values derived from the correct source of truth

Pay extra attention to:
- changed conditions or branching logic
- changed error propagation paths
- transformed or mapped data
- timeout and retry logic
- background job or queue logic

---

## Data Integrity

Check:
- are transactions used where multiple writes must succeed together
- are partial write or rollback scenarios covered
- is there risk of silent data loss
- are database constraints respected at the code level
- is idempotency required and implemented where needed
- are concurrent writes handled safely

Pay extra attention to:
- any code that modifies shared or critical data
- bulk operations
- migrations or schema changes

---

## Security

Check:
- is all external input validated at the boundary
- are authorization checks present and correctly placed
- is sensitive data absent from responses, logs, and error messages
- are SQL / command / template injection risks excluded
- are secrets handled safely (not hardcoded, not logged)
- are rate limiting or abuse prevention requirements met

Pay extra attention to:
- new endpoints or parameters
- changes to auth or permission logic
- any place where external input reaches a database, filesystem, or shell

---

## Regression Risk

Check:
- can the change break existing consumers or callers
- does it change shared behavior indirectly
- does it affect app initialization or middleware order
- does it change response shape, status codes, or error format
- does it affect shared utilities, models, or repositories

Pay extra attention to:
- changes to shared middleware
- changed response contracts
- modified query logic
- changed error handling that callers may depend on

---

## Local Consistency

Check:
- does the change follow the pattern already used in the target area
- does it match local data access approach
- does it match local error handling approach
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
- is the logic split at the right level
- is duplication acceptable or already growing into noise
- are comments useful and accurate
- is the code easy to modify without breaking neighboring logic

Prefer small, understandable code over clever compact code.

---

## Error Handling

Check:
- are errors caught at the right level
- are errors propagated with enough context
- are HTTP status codes or error codes correct and consistent
- are error messages safe to expose (no stack traces, no internal details in responses)
- is logging useful without being noisy or leaking sensitive data

---

## Comments

Check:
- do comments explain a real constraint or non-obvious decision
- are TODOs specific and useful
- are comments still accurate after the change
- do comments repeat obvious code instead of adding context

Prefer improving code clarity over adding weak comments.

---

## Red Flags

Treat these as strong review signals:
- changed behavior hidden inside refactor-like cleanup
- broad scope without clear need
- missing transaction where data integrity requires it
- authorization check placed after data access
- external input reaching a query or command without validation
- error swallowed silently
- response contract changed without versioning or coordination
- sensitive data in logs or responses
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
