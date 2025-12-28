# Copilot Instructions for Guillotina React

This document provides context and guidelines for AI assistants working with the Guillotina React (react-gmi) project.

## Project Overview

**Guillotina React** (`@guillotinaweb/react-gmi`) is a React-based management interface framework for [Guillotina](https://guillotina.io/), a high-performance async REST resource application server. It provides a flexible, extensible UI layer for managing Guillotina content, permissions, and workflows.

### Key Characteristics

- **Framework-first approach**: Designed to be extended and customized from outside
- **Content management**: Browse, create, modify, and delete Guillotina content based on user permissions
- **Permission-based UI**: Renders interface elements based on user roles and permissions
- **Extensible registry**: Override views, actions, forms, behaviors, and components via a registry pattern
- **Internationalization**: Built-in i18n support with react-intl (en, es, ca locales)

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript 5.4+ |
| Framework | React 16.12+ / 17 / 18 / 19 |
| Styling | Bulma CSS 0.9.4, Sass |
| Build | Microbundle (outputs CJS, ESM, UMD) |
| Testing | Vitest (unit), Cypress (E2E) |
| i18n | react-intl / formatjs |
| Linting | ESLint with TypeScript parser |
| Formatting | Prettier |

## Project Structure

```
src/guillo-gmi/
├── actions/          # User actions (add, copy, move, remove items)
├── components/       # React UI components
│   ├── behaviors/    # Behavior-specific components (attachments, workflows)
│   ├── fields/       # Field rendering and editing components
│   ├── input/        # Form input components
│   ├── panel/        # Panel components (properties, permissions, items)
│   ├── ui/           # Base UI components (icons, loading, etc.)
│   └── widgets/      # Widget components
├── contexts/         # React contexts (Traversal, Client, Auth)
├── forms/            # Form definitions (base, users, required fields)
├── hooks/            # Custom React hooks
├── lib/              # Core utilities (auth, client, REST, search, helpers)
├── locales/          # i18n message files
├── models/           # Data models (ItemModel, sharing)
├── reducers/         # State management reducers
├── scss/             # Sass stylesheets
├── types/            # TypeScript type definitions
└── views/            # View components for different content types
```

## Core Concepts

### Traversal Context

The `Traversal` class is the central context that provides:
- Current path navigation
- Context (current content object)
- Client for API calls
- Registry access for component overrides
- State dispatch for actions, flash messages, refresh

```typescript
// Accessing traversal in components
const ctx = useTraversal()
ctx.path      // Current path
ctx.context   // Current Guillotina object
ctx.client    // GuillotinaClient instance
ctx.refresh() // Trigger data refresh
ctx.flash()   // Show notification
```

### Registry System

The registry allows overriding default components:

```typescript
const registry = {
  views: { MyType: MyTypeView },        // Content type views
  actions: { myAction: MyAction },       // Custom actions
  forms: { MyType: MyForm },            // Type-specific forms
  behaviors: { 'my.behavior': MyBehavior }, // Behavior views
  itemsColumn: { MyType: () => [...] }, // Custom columns
  schemas: { MyType: { ... } },         // Schema overrides
  properties: { MyType: { ... } },      // Property panel config
}
```

### Guillotina Types

Key TypeScript types for Guillotina objects:

- `GuillotinaCommonObject`: Base content object type
- `SearchItem`: Search result item type
- `GuillotinaSchema`: Schema definition type
- `GuillotinaFile`: File/attachment type
- `GuillotinaVocabulary`: Vocabulary type

### Client & REST

```typescript
// Client usage
const client = useGuillotinaClient()
await client.get(path)
await client.getContext(path)

// REST operations
client.rest.get(path)
client.rest.post(path, data)
client.rest.patch(path, data)
client.rest.delete(path)
```

## Development Guidelines

### Code Style

- Use TypeScript with strict mode
- Use functional components with hooks
- Follow React best practices for state management
- Use Prettier for formatting (semi: false, singleQuote: true)
- Export from index files for clean imports

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.tsx`
- Utilities: `camelCase.ts`
- Types: `lowercase.ts`

### Component Patterns

```typescript
// Component with Traversal context
import { useTraversal } from '../contexts'

export function MyComponent() {
  const ctx = useTraversal()
  // Access ctx.context, ctx.client, ctx.path, etc.
}

// Component with config
import { useConfig } from '../hooks/useConfig'

export function MyComponent() {
  const cfg = useConfig()
  // Access configuration options
}
```

### Adding New Components

1. Create component in appropriate folder under `src/guillo-gmi/components/`
2. Export from `components/index.ts`
3. Export from main `index.ts` if public API
4. Add TypeScript types in `types/` if needed

### Adding New Actions

1. Create action component in `src/guillo-gmi/actions/`
2. Export from `actions/index.ts`
3. Register in the registry if needed

### Internationalization

```typescript
import { useIntl, FormattedMessage } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

// Using predefined messages
<FormattedMessage {...genericMessages.save} />

// Using useIntl hook
const intl = useIntl()
intl.formatMessage(genericMessages.save)
```

### Testing

```bash
# Unit tests with Vitest
yarn test

# E2E tests with Cypress (requires running Guillotina server)
cd e2e && yarn test
```

### Building

```bash
yarn build          # Full build (JS + CSS)
yarn build:js       # JavaScript only
yarn build:css      # CSS only
```

## Common Tasks

### Creating a New View

```typescript
// src/guillo-gmi/views/mytype.tsx
import { TabsPanel } from '../components/tabs'
import { useTraversal } from '../contexts'

export function MyTypeCtx() {
  const ctx = useTraversal()
  const tabs = {
    Properties: PanelProperties,
    // Add more tabs
  }
  return <TabsPanel tabs={tabs} currentTab="Properties" />
}
```

### Creating a Custom Form

```typescript
// Extend BaseForm for type-specific forms
import { BaseForm } from '../forms/base'

export function MyTypeForm(props) {
  return <BaseForm {...props} />
}
```

### Adding Behavior Support

```typescript
// src/guillo-gmi/components/behaviors/mybehavior.tsx
export function MyBehavior() {
  const ctx = useTraversal()
  const behaviorData = ctx.context['my.behavior.interface']
  // Render behavior-specific UI
}
```

## API Reference

For detailed API documentation, see [docs/api.md](docs/api.md).

## Useful Hooks

| Hook | Purpose |
|------|---------|
| `useTraversal()` | Access traversal context |
| `useGuillotinaClient()` | Get Guillotina client |
| `useConfig()` | Access configuration |
| `useRegistry()` | Access component registry |
| `useLocation()` | URL location management |
| `useCrudContext()` | CRUD operations context |
| `useVocabulary()` | Load vocabulary data |
| `useRemoteField()` | Remote field data fetching |
