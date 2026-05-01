# CSS Code Style Rules

These rules describe how styles should look.
They do not define when or where changes should be applied.

---

## Core Rules

Produce styles that are readable, predictable, easy to scan, and safe to extend.

- prefer clarity and consistency over micro-optimization
- keep styles close to the component or module they belong to
- prefer local clarity over premature reuse
- avoid writing styles that depend on fragile DOM structure
- avoid unnecessary nesting and unnecessary selector specificity
- prefer consistency with nearby code over inventing new spacing or color patterns
- avoid arbitrary values without a reason

---

## Property Grouping

Group properties by purpose and separate groups with an empty line.

Preferred order:

1. positioning
2. box model (dimensions, spacing)
3. layout (display mode and its properties)
4. typography
5. visual appearance
6. animation and transitions
7. miscellaneous

Keep a stable order inside each group. Follow the local ordering pattern if one exists.
Do not sort alphabetically if it makes related properties harder to read.

Example:
```css
.block {
  position: relative;
  top: 0;
  z-index: 1;

  width: 100%;
  padding: 16px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;

  color: #000;
  background: #fff;
  border: 1px solid #ddd;

  transition: opacity 0.2s ease;
}
```

---

## Selectors and Nesting

Keep nesting shallow — prefer a maximum depth of 2 levels.
Prefer the lowest selector specificity that solves the task.
Style child elements explicitly only when the parent owns their structure.

Good:
```css
.block { display: flex; }

.block-title { font-weight: 600; }

.block:hover { opacity: 0.8; }

.card-title { margin-bottom: 8px; }
```

Avoid:
```css
.block {
  .header {
    .title {
      span { color: red; }
    }
  }
}

div .card .header .card-title { margin-bottom: 8px; }
```

If nesting becomes deep: flatten selectors, split into clearer blocks, move responsibility closer to the target element.
Avoid broad descendant styling as a default pattern.

---

## Class Naming

Names must reflect purpose, not visual trivia.

Prefer: `.card`, `.card-title`, `.actions`, `.btn-primary`

Avoid: `.red-text`, `.big-block`, `.left-part`, `.wrapper` when the role is more specific

Use neutral structural names (`.container`, `.wrapper`, `.inner`) only when the element is truly structural.

---

## Pseudo-classes and Pseudo-elements

Place them directly after the base selector.

Preferred order:
1. base selector
2. interactive states (`:hover`, `:focus`, `:active`)
3. pseudo-elements (`::before`, `::after`)
4. modifier / state combinations if needed

```css
.button { color: #111; }
.button:hover { color: #000; }
.button:focus { outline: 2px solid #333; }
.button::before { content: ''; }
```

---

## Media Queries

Prefer nesting media queries inside the selector they modify — easier to maintain and keep in sync.

```css
.card {
  padding: 16px;

  @media (max-width: 768px) {
    padding: 12px;
  }
}
```

Do not scatter responsive overrides across distant files or unrelated sections.

---

## Reuse, Variants, and Overrides

Small duplication is acceptable.

Do not extract mixins, helpers, or shared style fragments unless:
- the styles are actually reused
- the extraction reduces noise
- the abstraction has a clear name and responsibility

Prefer explicit variants over tangled conditional styling — a clear modifier, a named variant, separate local blocks when that improves readability.

Each selector or style block should have one clear responsibility. Avoid mixing base styles with unrelated overrides or distant child styling.

Prefer extending styles at the correct ownership level. Do not stack overrides across many layers — if a component is hard to style without repeated overrides, the structure is likely too fragile.

Avoid packing too much logic into one style block. Prefer explicit selectors and clear state blocks over complex conditional CSS.

---

## !important

Do not use `!important` unless there is no reasonable alternative.

Before using it, prefer:
- reducing selector conflicts
- moving the rule closer to the source
- correcting specificity problems
- checking style injection order

If unavoidable, use it minimally and only on the exact property that requires it.

---

## Comments in Styles

Use comments only when they explain a non-obvious constraint, a browser quirk, a temporary workaround, or a reason a simpler rule cannot be used.

Good:
```css
/* Safari clips this shadow incorrectly without overflow visible */
overflow: visible;
```

Do not comment obvious declarations.

---

## Visual Separation

Use empty lines to separate:
- property groups inside a rule
- logically different style blocks
- base selectors from related state selectors when needed

Do not add excessive blank lines that break visual flow.
