---
applyTo: '**'
---

# Guillotina React - Technical Guidelines

Implementation patterns and development practices for AI assistants.

## Project Structure

```
src/guillo-gmi/
├── actions/       # Modal-based user operations (add, copy, move, remove)
├── components/    # UI components organized by concern
│   ├── behaviors/ # Behavior-specific renderers (IAttachment, IWorkflow)
│   ├── fields/    # Field edit/render components
│   ├── input/     # Form inputs (Input, Select, Checkbox, FileUpload)
│   ├── panel/     # Tab panels (Items, Properties, Permissions, Edit)
│   ├── ui/        # Base UI (Icon, Loading, Dropdown)
│   └── widgets/   # Reusable widget components (Tags, etc.)
├── contexts/      # React contexts (Traversal, Client)
├── forms/         # Form components per content type
├── hooks/         # Custom hooks (useTraversal, useRegistry, etc.)
├── lib/           # Core utilities (client, auth, REST, search)
├── models/        # Data transformation classes
├── reducers/      # State management (guillotinaReducer)
├── types/         # TypeScript type definitions
└── views/         # Content type view components
```

## Core Patterns

### Traversal Pattern
Every component accessing Guillotina data uses the Traversal context:

```typescript
import { useTraversal } from '../contexts'

export function MyComponent() {
  const ctx = useTraversal()
  
  // Access current content
  const content = ctx.context
  
  // Check permissions
  if (!ctx.hasPerm('guillotina.ModifyContent')) return null
  
  // Trigger actions
  ctx.flash('Success!', 'success')
  ctx.refresh()
  ctx.doAction('myAction', { param: 'value' })
}
```

### Registry Pattern
Override defaults by registering components keyed by type/name:

```typescript
const registry: Partial<IRegistry> = {
  views: { MyType: MyTypeView },
  forms: { MyType: MyTypeForm },
  actions: { myAction: MyActionModal },
  behaviors: { 'my.behavior.Interface': MyBehaviorPanel },
  itemsColumn: { MyType: () => customColumns },
}

// Usage in Guillotina component
<Guillotina registry={registry} ... />
```

### CRUD Hook Pattern
Use `useCrudContext` for API operations with built-in state:

```typescript
const { post, loading, isError, errorMessage } = useCrudContext()

async function handleSubmit(data) {
  const { isError } = await post(data)
  if (!isError) ctx.refresh()
}
```

## Component Guidelines

### Functional Components Only
```typescript
// ✅ Correct
export function MyComponent({ prop }: Props) {
  const [state, setState] = useState(initial)
  return <div>...</div>
}

// ❌ Avoid class components
```

### Props Interface Pattern
```typescript
interface MyComponentProps {
  required: string
  optional?: number
  children?: React.ReactNode
}

export function MyComponent({ required, optional = 10 }: MyComponentProps) {
  // ...
}
```

### Export Pattern
Public components must export from index files:

```typescript
// components/index.ts
export * from './mycomponent'

// Main index.ts (only public API)
export * from './components'
```

## TypeScript Standards

### Strict Mode Enabled
- All variables must be typed
- No implicit `any`
- Null checks required

### Key Types
```typescript
// Content object from Guillotina
type GuillotinaCommonObject = {
  type_name: string
  uuid: string
  is_folderish: boolean
  parent: GuillotinaParentObject
  __behaviors__?: string[]
  // ...behavior data
}

// Search result item
type SearchItem = {
  id: string
  path: string
  depth: number
  // ...indexed fields
} & ItemsPropertyObject

// Generic index signature
type IndexSignature = { [key: string]: any }
```

### Generics for Type Safety
```typescript
// ItemColumn supports generic for different item types
interface ItemColumn<T extends SearchOrCommonObject> {
  title: string
  key: keyof T
  render?: (item: T) => React.ReactNode
}
```

## Internationalization

### Message Definition
```typescript
import { defineMessages } from 'react-intl'

export const myMessages = defineMessages({
  title: { id: 'my_component_title', defaultMessage: 'My Title' },
})
```

### Usage in Components
```typescript
import { useIntl, FormattedMessage } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

function MyComponent() {
  const intl = useIntl()
  
  // Hook usage
  const label = intl.formatMessage(genericMessages.save)
  
  // Component usage
  return <FormattedMessage {...genericMessages.title} />
}
```

## Testing Strategy

### Unit Tests (Vitest)
```bash
pnpm test          # Run all tests
pnpm test --watch  # Watch mode
```

Test files: `*.test.ts` or `*.test.tsx` alongside source files.

### E2E Tests (Playwright)
```bash
pnpm test:e2e                 # Run E2E tests (headless)
# Or manually:
cd e2e
pnpm playwright:test          # Headless mode
pnpm playwright:headed        # Headed (browser) mode
pnpm playwright:ui            # UI mode
pnpm playwright:debug         # Debug mode
```

Requires running Guillotina server (see `e2e/README.md`).

## Build Process

### Commands
```bash
pnpm build        # Full build (JS + CSS) using Vite
pnpm build:css    # Sass compilation
pnpm lint         # ESLint check
pnpm format       # Prettier formatting
```

### Output Structure
```
dist/
├── react-gmi.js         # CommonJS
├── react-gmi.modern.js  # ESM
├── index.d.ts           # TypeScript declarations
└── css/style.css        # Compiled styles
```

## Anti-Patterns to Avoid

| Anti-Pattern | Alternative |
|--------------|-------------|
| Inline styles | Use Bulma classes or Sass |
| Direct DOM manipulation | Use React state/refs |
| Prop drilling > 2 levels | Use Traversal context |
| String concatenation for classes | Use `classnames` helper |
| Hardcoded API endpoints | Use client.rest methods |
| `any` type | Define proper interfaces |
| Mutable state updates | Use spread/immutable patterns |

## Development Workflow

1. **Start dev environment**: Run local Guillotina + `pnpm dev`
2. **Make changes**: Edit source in `src/guillo-gmi/`
3. **Test locally**: Import from local path in example app
4. **Run tests**: `pnpm test` for unit, `pnpm test:e2e` for E2E
5. **Lint/format**: `pnpm lint && pnpm format`
6. **Build**: `pnpm build` to verify outputs
