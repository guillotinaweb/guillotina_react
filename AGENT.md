# AGENT.md - AI Agent Instructions

This file contains instructions and context for AI agents working on the Guillotina React project.

## Quick Reference

| Item | Value |
|------|-------|
| Package Name | `@guillotinaweb/react-gmi` |
| Language | TypeScript |
| Framework | React (16.12+, 17, 18, 19) |
| Styling | Bulma CSS + Sass |
| Build Tool | Microbundle |
| Test Framework | Vitest (unit), Cypress (E2E) |
| Package Manager | Yarn |

## Essential Commands

```bash
# Install dependencies
yarn

# Development
yarn start                    # Start development server

# Building
yarn build                    # Build JS + CSS for production
yarn build:js                 # Build JavaScript only (microbundle)
yarn build:css                # Build CSS only (sass)

# Testing
yarn test                     # Run unit tests (vitest)
cd e2e && yarn test           # Run E2E tests (requires Guillotina server)

# Code Quality
yarn lint                     # Run ESLint
yarn format                   # Format code with Prettier
yarn format:check             # Check formatting

# Internationalization
yarn intl-extract             # Extract i18n messages
yarn intl-compile             # Compile all locales
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Guillotina Component                    │
│  (Main entry point - manages state, routing, i18n)          │
├─────────────────────────────────────────────────────────────┤
│                      TraversalProvider                       │
│  (Context provider - exposes Traversal instance)            │
├─────────────────────────────────────────────────────────────┤
│                         Registry                             │
│  (Component overrides: views, actions, forms, behaviors)    │
├───────────────┬─────────────────┬───────────────────────────┤
│    Views      │    Components   │        Actions            │
│  (Content     │  (UI elements,  │  (User interactions:      │
│   type views) │   panels, forms)│   add, copy, move, etc)   │
├───────────────┴─────────────────┴───────────────────────────┤
│                    GuillotinaClient                          │
│  (REST API wrapper for Guillotina server)                   │
├─────────────────────────────────────────────────────────────┤
│                         Auth                                 │
│  (Authentication: login, logout, token management)          │
└─────────────────────────────────────────────────────────────┘
```

## Key Files to Understand

### Entry Points
- [src/guillo-gmi/index.ts](src/guillo-gmi/index.ts) - Main exports
- [src/guillo-gmi/components/guillotina.tsx](src/guillo-gmi/components/guillotina.tsx) - Main component

### Core Infrastructure
- [src/guillo-gmi/contexts/index.tsx](src/guillo-gmi/contexts/index.tsx) - Traversal context
- [src/guillo-gmi/lib/client.tsx](src/guillo-gmi/lib/client.tsx) - Guillotina API client
- [src/guillo-gmi/lib/auth.ts](src/guillo-gmi/lib/auth.ts) - Authentication
- [src/guillo-gmi/lib/rest.ts](src/guillo-gmi/lib/rest.ts) - REST client
- [src/guillo-gmi/hooks/useRegistry.tsx](src/guillo-gmi/hooks/useRegistry.tsx) - Registry system
- [src/guillo-gmi/reducers/guillotina.ts](src/guillo-gmi/reducers/guillotina.ts) - State management

### Type Definitions
- [src/guillo-gmi/types/guillotina.ts](src/guillo-gmi/types/guillotina.ts) - Guillotina types
- [src/guillo-gmi/types/global.ts](src/guillo-gmi/types/global.ts) - Global utility types

## Code Patterns

### 1. Accessing Guillotina Context

```typescript
import { useTraversal } from '../contexts'

function MyComponent() {
  const ctx = useTraversal()
  
  // Current content object
  const content = ctx.context
  
  // API operations
  const data = await ctx.client.get(path)
  
  // UI feedback
  ctx.flash('Operation successful', 'success')
  ctx.refresh()
}
```

### 2. Creating Components with Types

```typescript
import { GuillotinaCommonObject } from '../types/guillotina'

interface MyComponentProps {
  item: GuillotinaCommonObject
  onAction?: () => void
}

export function MyComponent({ item, onAction }: MyComponentProps) {
  // Component implementation
}
```

### 3. Using the Registry

```typescript
import { useRegistry } from '../hooks/useRegistry'

function MyComponent() {
  const registry = useRegistry()
  
  // Get registered view for a type
  const View = registry.get('views', typeName)
  
  // Get registered action
  const Action = registry.get('actions', actionName)
}
```

### 4. Form Components

```typescript
import { Input, Select, Button, Form } from '../components'

function MyForm() {
  const [data, setData] = useState({})
  
  return (
    <Form onSubmit={handleSubmit}>
      <Input 
        name="title" 
        value={data.title} 
        onChange={(e) => setData({...data, title: e.target.value})} 
      />
      <Button type="submit">Save</Button>
    </Form>
  )
}
```

### 5. Internationalization

```typescript
import { useIntl, FormattedMessage } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

function MyComponent() {
  const intl = useIntl()
  
  // In JSX
  return <FormattedMessage {...genericMessages.save} />
  
  // Programmatic
  const label = intl.formatMessage(genericMessages.save)
}
```

## Important Conventions

### File Organization
- **One component per file** for main components
- **Export from index.ts** files at each directory level
- **Co-locate tests** with source files using `.test.ts` or `.spec.ts` suffix

### Naming Conventions
- **Components**: PascalCase (e.g., `PanelProperties.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useConfig.tsx`)
- **Actions**: PascalCase (e.g., `AddItem.tsx`)
- **Types**: PascalCase for interfaces/types
- **Files**: Match the primary export name

### TypeScript Guidelines
- Use strict mode (enabled in tsconfig)
- Define interfaces for component props
- Use generics for reusable components
- Prefer `interface` over `type` for object shapes
- Export types from `types/` directory

### React Guidelines
- Use functional components with hooks
- Use `React.FC` sparingly (prefer explicit prop types)
- Handle loading and error states
- Use `ErrorBoundary` for error handling
- Memoize expensive computations

## Testing Guidelines

### Unit Tests (Vitest)
- Located alongside source files
- Use `*.test.ts` or `*.spec.ts` naming
- Test pure functions and hooks
- Mock external dependencies

```typescript
// Example: src/guillo-gmi/lib/search.test.js
import { describe, it, expect } from 'vitest'
import { parser, buildQs } from './search'

describe('parser', () => {
  it('should parse search terms', () => {
    // Test implementation
  })
})
```

### E2E Tests (Cypress)
- Located in `e2e/cypress/integration/`
- Requires running Guillotina server
- Use selectors from `e2e/cypress/elements/`
- Configuration in `e2e/cypress.config.js`

## Debugging Tips

### Common Issues

1. **Context not loaded error**
   - Ensure component is wrapped in `TraversalProvider`
   - Check if async data is loaded before accessing

2. **Type errors with Guillotina objects**
   - Use proper type guards
   - Check optional properties with `?.`

3. **Build errors**
   - Run `yarn build:js` to see TypeScript errors
   - Check imports are from correct paths

### Useful Debug Points
- `GuillotinaClient.getContext()` - API responses
- `guillotinaReducer` - State changes
- `Traversal.dispatch()` - Action dispatching

## Making Changes

### Before Making Changes
1. Understand the existing patterns in similar files
2. Check type definitions in `types/`
3. Review related components for context
4. Run tests to ensure baseline works

### When Making Changes
1. Follow existing code style
2. Add/update TypeScript types
3. Export new components from index files
4. Add i18n messages if adding user-facing text
5. Consider backwards compatibility

### After Making Changes
1. Run `yarn lint` to check for issues
2. Run `yarn test` for unit tests
3. Run `yarn build` to verify build succeeds
4. Test in browser if UI changes

## External Dependencies

### Key Dependencies
- **react-intl**: Internationalization
- **react-beautiful-dnd**: Drag and drop
- **bulma**: CSS framework
- **jwt-decode**: JWT token parsing
- **brace**: Code editor (ACE)

### Peer Dependencies
- React 16.12+ / 17 / 18 / 19
- React DOM (matching React version)

## Links

- [Main README](README.md)
- [API Documentation](docs/api.md)
- [Extension Guide](docs/extend.md)
- [Tutorial](docs/tutorial/tutorial.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Guillotina Documentation](https://guillotina.readthedocs.io/)
