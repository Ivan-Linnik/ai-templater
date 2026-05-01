# 🤖 ai-templater

CLI tool for setting up [Claude Code](https://docs.anthropic.com/en/docs/claude-code) instruction files in your project — defines agent roles, coding standards, and reviewer guidelines for AI-assisted development.

---

## 🎭 Roles

| Role | Description |
|---|---|
| `architect-fe` / `architect-be` | Architecture decisions and tech choices |
| `code-styler` | Code style enforcement |
| `implementer` | Feature implementation |
| `reviewer-fe` / `reviewer-be` | Code review |
| `snapshot-creator` | Project snapshot maintenance |

---

## ⚙️ Commands

```
ait init [--force]    First-time setup — creates .claude/ and CLAUDE.md
ait add [fe|be]       Add a direction to an existing .claude setup
ait clean [--force]   Remove .claude/ and CLAUDE.md
```

---

## 🚀 Usage

### init

```bash
npx github:Ivan-Linnik/ai-templater#master init
```

Prompts for direction and (for BE) a language:

- **Direction**: FE / BE / Both
- **Language** (BE only): TypeScript / Go / Python / Other

Use `--force` to overwrite an existing `.claude/` without confirmation.

### add

```bash
ait add fe
ait add be
ait add        # prompts interactively
```

Adds a direction to an existing `.claude/` setup. Use `ait init --force` to reinitialize with both directions.

### clean

```bash
ait clean
ait clean --force
```

Removes `.claude/` and optionally `CLAUDE.md`. Use `--force` to skip confirmation prompts.

---

## 📁 What gets created

File set depends on the selected direction.

```
.claude/
├── AGENTS.md                    # agent routing rules
├── agents/
│   ├── code-styler.md           # always
│   ├── implementer.md           # always
│   ├── snapshot-creator.md      # always
│   ├── architect-fe.md          # FE / Both
│   ├── reviewer-fe.md           # FE / Both
│   ├── architect-be.md          # BE / Both
│   └── reviewer-be.md           # BE / Both
├── shared/
│   ├── code-comments.md         # always
│   ├── code-style-ts.md         # FE / Both / BE+TS
│   ├── code-style-styles.md     # FE / Both
│   ├── imports.md               # FE / Both / BE+TS
│   ├── review-checklist-fe.md   # FE / Both
│   └── review-checklist-be.md   # BE / Both
└── settings.json

CLAUDE.md
```

---

## 🧩 How it works

1. Claude reads `CLAUDE.md` in the project root
2. `CLAUDE.md` points Claude to `.claude/AGENTS.md`
3. `AGENTS.md` routes tasks to the relevant agent role and shared rules

---

## 💡 Tips

- Claude may ignore the instructions on first launch — explicitly tell it to read them: `Read and use your local instructions` or similar.

- Claude may also ignore the instructions after compacting the context. Tell it to read them again after that.

- Codex also understands these instructions if you prompt it.