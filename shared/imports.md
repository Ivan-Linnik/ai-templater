# Import Rules

Apply these rules when adding, editing, sorting, or reviewing imports in frontend files.

These rules are for executable agent behavior, not for human learning materials.

---

## Goal

Keep imports predictable, easy to scan, and safe to maintain.

A developer should be able to quickly understand:
- external dependencies of the file
- internal project dependencies
- local dependencies
- whether the file imports styles or side-effect modules

---

## Primary Rule

Imports must be grouped by source type.

Groups must appear in a fixed order.

Each group must be separated by one empty line.

Within a group, imports should be sorted alphabetically by import path unless a safety rule below prevents reordering.

---

## Import Group Order

Use this order exactly:

### 1. External libraries
Packages from `node_modules`.

Examples:
- `react`
- `react-dom`
- routing libraries
- form libraries
- utility libraries

### 2. Absolute internal imports
Project modules imported through aliases or project-root absolute paths.

Examples:
- `@/shared/...`
- `@/entities/...`
- `@/features/...`
- `@/widgets/...`
- other configured internal aliases

### 3. Relative imports
Local dependencies relative to the current file.

Examples:
- sibling components
- local hooks
- local helpers
- local constants
- local types

### 4. Styles / side-effect imports that must stay last in their local block
Examples:
- CSS / SCSS / LESS files
- reset files
- polyfills
- modules imported only for side effects

If a style or side-effect import is relative, keep it at the end of the relative section unless execution order requires otherwise.

---

## Relative Import Depth Rule

If a relative import goes deeper than `../../`, prefer replacing it with an absolute internal import if the project supports it.

Examples:
- allowed: `../x`, `../../y`
- should be replaced when possible: `../../../z`

Do not rewrite the path automatically unless:
- the alias is already used in the project
- the target path is unambiguous
- the change is safe and local

If any of these are unclear, keep the existing path and report it as a possible follow-up instead of changing it.

---

## Sorting Rules

### Sort by import path
Inside each safe group, sort imports alphabetically by module path.

### Keep related specifiers stable
Inside one import statement, do not reorder imported specifiers unless:
- project tooling already enforces it
- the change is clearly safe
- no semantic grouping is being relied on for readability

### Do not optimize import style unless asked
Do not automatically:
- merge separate imports from the same module
- split one import into multiple imports
- convert type/value imports style
- rewrite namespace/default/named import forms

Only do this if explicitly requested or already enforced by local project conventions.

---

## Safety Rules

Do not reorder imports if order may affect execution.

Treat the following as high-risk:

### 1. Side-effect imports
Examples:
- polyfills
- global CSS
- init/setup modules
- instrumentation
- monkey patches

### 2. Imports with known execution-order sensitivity
Examples:
- app bootstrap files
- provider setup
- initialization modules
- environment setup
- test setup files

### 3. CSS import order that may affect cascade
If multiple style imports exist and order may matter, preserve existing order unless the task explicitly requires changing it.

### 4. Unclear mixed groups
If the file combines:
- side effects
- styles
- setup modules
- regular imports

and the safe order is not obvious, preserve current order and report uncertainty instead of reordering aggressively.

---

## Allowed Changes

You may:
- group imports by source type
- insert one empty line between groups
- alphabetize safe import groups by path
- move relative style imports to the bottom of the relative section when clearly safe
- remove obviously unused imports if that is part of the task or a style-cleanup pass
- suggest replacing deep relative imports with aliases when the project already supports aliases

---

## Forbidden Changes

Do not:
- reorder side-effect imports blindly
- change import paths semantically
- introduce new aliases that are not already used in the project
- rewrite module boundaries under the guise of import cleanup
- move imports across groups if that changes execution meaning
- rewrite public API usage just to reduce import count
- scan and normalize the whole repository unless explicitly asked

Import cleanup must stay local to the task scope.

---

## File-Level Layout

Preferred import layout:

1. external libraries
2. empty line
3. absolute internal imports
4. empty line
5. relative imports
6. empty line if needed
7. local styles / side-effect relative imports

Example:

```ts
import { useEffect, useState } from 'react'
import { useRouter } from 'some-router-lib'

import { UserCard } from '@/entities/user'
import { useUserData } from '@/entities/user/hooks'

import { Header } from '../../Header'
import { useLocalState } from './hooks'

import './styles.css'
```

## Review Rules for Agents

When reviewing imports:

Flag:
- mixed source types without grouping
- missing empty lines between groups
- deep relative imports that should likely be aliases
- style imports placed in the middle of regular local imports without reason
- clearly unused imports
- dangerous reorderings of setup/style/side-effect imports

Do not flag:
- preserved order in bootstrap/setup files when order may be intentional
- local deviations that protect execution order
- non-critical specifier ordering unless the project explicitly requires it

Prefer safety over cosmetic consistency.

---

## Editing Rules for Agents

When modifying imports:

Safe default
- reorder only the imports in the current file
- preserve execution-sensitive imports
- keep changes minimal

If import order is ambiguous
- keep the existing order
- do not guess
- mention the ambiguity

If a path migration is desirable but not guaranteed safe
- do not perform it automatically
- report it as a follow-up suggestion

---

## Scope Rules for Agents

Apply import cleanup only:
- in files changed by the current task
- in explicitly requested style-cleanup scope
- in review comments for the inspected diff/files

Do not perform repository-wide import normalization unless explicitly requested.

---

## Safe Default

If unsure whether an import can be moved:
- assume order may matter
- preserve the current order
- only normalize clearly safe groups
