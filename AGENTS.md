# AGENTS.md - AI Agent Instructions

This file contains instructions and context for AI agents working on the Guillotina React project. Compatible with both Cursor and VSCode AI assistants.

## Business Purpose

Guillotina React is a **framework-first React UI layer** for [Guillotina](https://guillotina.io/), enabling developers to build custom content management interfaces. It solves the problem of rapidly creating admin UIs for Guillotina-based applications while maintaining full customization flexibility.

**Target users**: Developers building content management systems, admin panels, or data management interfaces on top of Guillotina REST API.

## Quick Reference

| Item | Value |
|------|-------|
| Package Name | `@guillotinaweb/react-gmi` |
| Language | TypeScript 5.4+ (strict) |
| Framework | React (16.12+, 17, 18, 19) |
| Styling | Bulma CSS + Sass |
| Build Tool | Vite |
| Test Framework | Vitest (unit), Playwright (E2E) |
| Package Manager | pnpm |

## Strategic Architectural Decisions

### 1. Registry Pattern for Extensibility
The registry system is the core architectural decision, allowing complete UI customization without forking. Override views, forms, actions, behaviors per content type while maintaining upgradability.

### 2. Traversal Context as Central State
All components access Guillotina data through the `Traversal` context class, providing current path, content object, permission filtering, and centralized action dispatch.

### 3. Permission-Driven Rendering
UI elements render based on Guillotina permissions. Tabs, actions, and fields appear/hide based on user roles, suitable for multi-tenant applications.

## Technology Context

| Technology | Why Chosen |
|------------|------------|
| TypeScript 5.4+ (strict) | Framework reliability and type-safe extensions |
| React 16.12+ - 19 | Wide compatibility for consumer applications |
| Vite | Fast build tool with HMR, generates CJS and ESM outputs |
| Bulma CSS + Sass | Extensible CSS without JS dependencies |
| react-intl | Industry standard i18n |
| Vitest + Playwright | Fast unit tests + E2E validation |

## Essential Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                      # Start development server (playground with HMR)

# Building
pnpm build                    # Build JS + CSS for production
pnpm build:css                # Build CSS only (sass)

# Testing
pnpm test                     # Run unit tests (vitest)
pnpm test:e2e                 # Run E2E tests (requires Guillotina server)

# Code Quality
pnpm lint                     # Run ESLint
pnpm format                   # Format code with Prettier
pnpm format:check             # Check formatting

# Internationalization
pnpm intl-extract             # Extract i18n messages
pnpm intl-compile             # Compile all locales
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

## Domain Concepts

### Content Hierarchy (Traversal)
Guillotina organizes content in a tree structure accessible via REST API paths:
- **Application** → Top-level entry point (list of databases)
- **Database** → Contains containers
- **Container** → Root folder for content (like a "site")
- **Folder** → Contains child items (folderish)
- **Item** → Leaf content objects

The **path** represents location in this hierarchy: `/db/container/folder1/item1`

### Content Types
Guillotina content types define structure and behavior:
- `Folder`: Container for other objects
- `Item`: Basic content object
- `User`: System user (in UserManager)
- `Group`: User group (in GroupManager)
- Custom types defined by applications

### Behaviors
Behaviors are mixins that add functionality to content:
- `IDublinCore`: Metadata (title, description, dates, creators)
- `IAttachment`: Single file attachment
- `IMultiAttachment`: Multiple file attachments
- `IImageAttachment`: Image with scales
- `IWorkflow`: Workflow state management

### Permissions Model
Guillotina uses a fine-grained permission system:
- **Permissions**: Atomic rights (`guillotina.ViewContent`, `guillotina.ModifyContent`)
- **Roles**: Collections of permissions (`guillotina.Manager`, `guillotina.Editor`)
- **Principals**: Users and groups that receive role assignments

## Primary Workflows

### Content Browsing Flow
1. User navigates via path (URL query param `?path=/db/container/...`)
2. `Guillotina` component fetches context via `client.getContext(path)`
3. Permissions are checked via `client.canido(path, Permissions)`
4. Registry determines which view component to render based on content type
5. View renders tabs filtered by user permissions

### Content Creation Flow
1. User triggers `addItem` action with content type
2. Registry provides appropriate form component for type
3. Form collects data and calls REST API to create object
4. On success, context refreshes and navigates to new item

### Permission-Based Rendering
```
User Request → Fetch Context → Check Permissions → Filter UI
                                    ↓
                TabsPanel shows only permitted tabs
                Actions show only permitted operations
                Fields render based on edit/view rights
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

## Testing Strategy

### Unit Tests (Vitest)
```bash
pnpm test          # Run all tests
pnpm test --watch  # Watch mode
```

Test files: `*.test.ts` or `*.test.tsx` alongside source files.

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

## AI Decision Framework

### When Adding Features
1. **Registry-first**: Check if it can be a registry extension point
2. **Hooks over HOCs**: Prefer hooks for new functionality
3. **Traversal pattern**: All components must support Traversal context
4. **Export discipline**: Public APIs must export from `index.ts`

### When Fixing Issues
1. Verify bug is in core library, not consumer code
2. Consider if fix should be a registry override instead
3. Ensure backward compatibility for registry consumers

### When Modifying Components
1. Preserve registry override capabilities
2. Keep components composable and single-responsibility
3. Use TypeScript generics for type-safe extensions

## Quality Principles

**Good contributions**:
- Extend without breaking registry consumers
- Functional components + hooks pattern
- TypeScript types for all public APIs
- Export from appropriate index files
- Use react-intl for all user-facing strings

**Avoid**:
- Breaking registry interface signatures
- Class components
- Direct state mutation
- Hardcoded strings

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

## Business Rules

### UI Filtering Rules
- Tabs require specific permissions to display (e.g., Edit tab needs `guillotina.ModifyContent`)
- Actions check permissions before rendering buttons
- Properties panel respects `ViewContent` vs `ModifyContent`

### Content Type Rules
- Folderish types can contain children (Folder, Container)
- Non-folderish types are leaf nodes (Item)
- UserManager/GroupManager are special containers for principals

### Behavior Rules
- Behaviors listed in `__behaviors__` array are active on object
- `@static_behaviors` are always applied to the type
- Behavior components render only when behavior is active

## Integration Points

### Guillotina REST API
The framework expects a Guillotina server providing:
- `GET /{path}`: Fetch content object
- `POST /{path}`: Create child object
- `PATCH /{path}`: Update object
- `DELETE /{path}`: Delete object
- `GET /@canido`: Check permissions
- `GET /@types`: List available content types
- `GET /@search`: Search content (PostgreSQL or Elasticsearch)

### Authentication
Auth is handled via JWT tokens:
- `Auth` class manages token storage/refresh
- Tokens include user principal and roles
- Expiration triggers re-login

## Extension Philosophy

**Consumer applications should extend via registry, not fork**:
- Register custom views for new content types
- Override default forms with type-specific forms
- Add custom actions for domain operations
- Define behavior components for custom behaviors
- Configure column renderers for content lists

## Git Commit Conventions

### Commit Message Format
Based on observed patterns in the repository, commits follow a type-prefixed format:

```
<type>: <description>

[optional body]
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | New features or capabilities |
| `fix` | Bug fixes |
| `chore` | Maintenance tasks, dependency updates, tooling |
| `refactor` | Code restructuring without behavior change |
| `docs` | Documentation changes |
| `test` | Test additions or modifications |
| `wip` | Work in progress (feature branches only) |

### Examples
```bash
# Features
feat: Add to registry the possibility to override the default actions in items list
feat: Add default sort value (#218)
feat: improve types

# Fixes
fix: expiration token
fix: Confirm component, message type
fix: Email input

# Chores
chore: improve typing registry
chore: bump version to 0.33.0
chore: Add vite example
```

### Commit Guidelines
- Start with lowercase after type prefix
- Be concise but descriptive (50 chars for title)
- Reference issue numbers when applicable: `(#123)`
- Group related changes in single commit
- One logical change per commit

### Branch Naming
```
<type>/<short-description>
```

Examples:
```bash
feat/registry-actions-override
fix/token-expiration
chore/improve-typing
refactor/strict-mode
```

### Pull Request Standards
- Title format: Follow same format as commits
- Description: Summarize the change and motivation
- List breaking changes if any
- Reference related issues
- PRs are typically squash-merged

## Debugging Tips

### Common Issues

1. **Context not loaded error**
   - Ensure component is wrapped in `TraversalProvider`
   - Check if async data is loaded before accessing

2. **Type errors with Guillotina objects**
   - Use proper type guards
   - Check optional properties with `?.`

3. **Build errors**
   - Run `pnpm build` to see TypeScript errors
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
1. Run `pnpm lint` to check for issues
2. Run `pnpm test` for unit tests
3. Run `pnpm build` to verify build succeeds
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

## Development Workflow

1. **Start dev environment**: Run local Guillotina + `pnpm dev`
2. **Make changes**: Edit source in `src/guillo-gmi/`
3. **Test locally**: Import from local path in example app
4. **Run tests**: `pnpm test` for unit, `pnpm test:e2e` for E2E
5. **Lint/format**: `pnpm lint && pnpm format`
6. **Build**: `pnpm build` to verify outputs

## Links

- [Main README](README.md)
- [API Documentation](docs/api.md)
- [Extension Guide](docs/extend.md)
- [Tutorial](docs/tutorial/tutorial.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Guillotina Documentation](https://guillotina.readthedocs.io/)

## Related Instruction Files

For more detailed context, see:
- [Functional Context](.github/instructions/project-functional.instructions.md) - Domain concepts, Guillotina integration
- [Technical Guidelines](.github/instructions/project-technical.instructions.md) - Code patterns, testing, build
- [Git Conventions](.github/instructions/git-commit.instructions.md) - Commit standards, branch naming
- [Copilot Instructions](.github/copilot-instructions.md) - Strategic overview and decision framework
