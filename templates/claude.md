## STEP 1 — MANDATORY: Declare role before any action.

State this before anything else: "Role: <role> — <one-line reason>"

Role options: architect-fe / architect-be / reviewer-fe / reviewer-be / code-styler / implementer / snapshot-creator
Full routing rules: see below (AGENTS.md § Task Routing)

Do NOT proceed without this step.

---

## STEP 2 — MANDATORY: Read the agent file before acting.

After declaring the role, read `.claude/agents/<role-name>.md` before doing anything else.

- Follow the output format and rules in that file exactly.
- Do not improvise format or infer items the file says to ask about.

Do NOT skip this step even if you think you remember the instructions.

---

@.claude/AGENTS.md

---

# Project AI Instructions

This project uses a structured AI workflow defined in `.claude`.

---

## Context loading rules

- DO NOT load all files blindly
- Load only what is necessary for the current task

Available context:
- Agents: `.claude/agents/`
- Shared rules: `.claude/shared/`
- Project snapshot: `project-snapshot.md` (if present)

---

## Task execution principles

- Start with analysis before writing code
- If the task is analysis-only, stop at diagnosis and solution design
- If the task explicitly requests to fix or implement, proceed with implementation following AGENTS.md rules
- If context is missing, ask for clarification
- Prefer minimal, targeted changes over broad rewrites
- Avoid assumptions about business logic

---

## Output expectations

Be explicit about:
- what is known
- what is assumed
- what is missing

If uncertainty exists:
- clearly state it
- propose safe options

Do not move from diagnosis to code changes without explicit user approval.

Response language:
- always respond in the user's language
- do not switch languages unless explicitly requested
- keep the full response in one language

---
