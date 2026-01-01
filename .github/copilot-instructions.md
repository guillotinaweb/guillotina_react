# Copilot Instructions for Guillotina React

Strategic context for AI assistants working with the Guillotina React (`@guillotinaweb/react-gmi`) project.

## Business Purpose

Guillotina React is a **framework-first React UI layer** for [Guillotina](https://guillotina.io/), enabling developers to build custom content management interfaces. It solves the problem of rapidly creating admin UIs for Guillotina-based applications while maintaining full customization flexibility.

**Target users**: Developers building content management systems, admin panels, or data management interfaces on top of Guillotina REST API.

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
| Vitest + Cypress | Fast unit tests + E2E validation |
| pnpm | Fast, disk-efficient package manager |

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

## Related Instruction Files

- [Functional Context](instructions/project-functional.instructions.md) - Domain concepts, Guillotina integration
- [Technical Guidelines](instructions/project-technical.instructions.md) - Code patterns, testing, build
- [Git Conventions](instructions/git-commit.instructions.md) - Commit standards, branch naming
