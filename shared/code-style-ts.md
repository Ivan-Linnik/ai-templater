# TypeScript / TSX Code Style Rules

These rules describe how code should look.
They do not define when or where changes should be applied.

---

## Goal

Produce code that is:
- readable
- predictable
- easy to modify
- safe to extend

Code should be understandable without additional explanation.

---

## Primary Rule

Prefer clarity over compactness.

If code becomes harder to read when shortened, do not shorten it.

---

## File Structure

Keep a consistent structure inside each file.

Preferred order where applicable:

1. imports
2. types / interfaces
3. constants
4. main exported value (component, hook, function, class)
5. local helper functions and utilities

Not every file must contain all sections.
Prefer consistency within the current file and module.

---

## Component Structure

Inside a React component, prefer this order:

1. Destructure props at the top of the component body
2. hooks and refs
3. derived and memoized values
4. handlers and callbacks
5. early returns (loading, error, guards)
6. main JSX return

```tsx
const Component = (props: TComponentProps) => {
  const {prop1, prop2} = props

  const state = useStore()
  const [value, setValue] = useState()

  const derived = computeSomething(state)

  const handleClick = () => {}

  if (!state.ready) {
    return null
  }

  return <div />
}
```

---

## Hooks Rules

- do not call hooks conditionally
- keep hook order stable
- group hooks at the top of the component
- keep hook dependencies explicit unless there is a justified local exception

---

## Early Returns

Prefer early returns over nested conditions.

Use inline form when the branch contains a single simple statement.

Good:
```tsx
if (!data) return null
if (error) return <Error />
if (!user || !user.active || user.blocked) return null
```

Use block form only when the branch contains multiple statements.

Good:
```tsx
if (condition) {
  make1()
  doSomething(arg)

  return <Comp />
}
```

Avoid:
```tsx
if (data) {
  if (!error) {
    return <UI />
  }
}
```

---

## Conditionals

Keep conditions simple and readable.

If a condition becomes complex or is reused:
- extract it into a named variable

Prefer explicit checks over overly compact truthy/falsy chains.

Good:
```ts
if (!user || !user.active || user.blocked) return null
```

---

## Variables

Use variables to:
- name intent
- reduce repeated expressions
- simplify JSX

Avoid inline complex expressions in JSX.

Bad:
```tsx
<div>{items.filter(x => x.active).map(...).join(', ')}</div>
```

Good:
```ts
const activeItems = items.filter((item) => item.active)
```

---

## Functions

### Small functions
- keep close to usage when they are local to one component or function

### Reusable logic
- move outside the component or into hooks/helpers when it is reused or hides meaningful complexity

Do not extract logic only for the sake of reducing line count.

---

## Naming

Names must reflect intent, not implementation.

Names should make the code understandable without additional comments.

Prefer:
- isLoading, hasError, activeItems, handleSubmit

Avoid:
- data2, tmp, val, arr
- unclear abbreviations unless they are standard in the project or domain

Boolean variables should:
- start with is, has, should, can

---

## JSX Rules

### Keep JSX readable
- avoid deeply nested JSX
- split large blocks into variables or components

### Extract only when justified
Extract JSX into a variable or component if:
- it improves readability
- it is reused
- it reduces duplication

Do not extract everything into separate components by default.

---

## Inline Logic in JSX

Avoid complex logic directly in JSX.

Allowed:
- simple conditions
- short, readable maps

Avoid:
- multi-step transformations
- nested ternaries
- long chained expressions

---

## Ternary Rules

Allowed:
```tsx
condition ? <A /> : <B />
```

Avoid:
```tsx
condition1
  ? condition2
    ? <A />
    : <B />
  : <C />
```

If nesting appears:
- extract logic into variables

---

## Duplication Rule

Small duplication is acceptable.

Do not introduce abstraction when it makes the code harder to follow.

Abstract when:
- logic is reused
- duplication is growing
- abstraction reduces complexity
- the extracted name clarifies intent

---

## Expression Complexity

Avoid packing too much logic into a single expression.

Prefer:
- intermediate variables
- explicit conditions
- readable branching

Over:
- long chained expressions
- nested boolean logic
- dense inline transformations