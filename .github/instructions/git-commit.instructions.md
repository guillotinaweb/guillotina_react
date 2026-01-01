---
applyTo: '**'
---

# Git Commit Conventions

Standards for commits, branches, and pull requests in Guillotina React.

## Commit Message Format

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

### Examples from Repository

```bash
# Features
feat: Add to registry the possibility to override the default actions in items list
feat: Add default sort value (#218)
feat: improve types

# Fixes
fix: expiration token
fix: Confirm component, message type
fix: Email input
fix: size param in elasticsearch function

# Chores
chore: improve typing registry
chore: bump version to 0.33.0
chore: Add vite example
chore: github actions

# Refactors
refactor: parseSearchQueryParamFunction name
Refactor types to use SearchOrCommonObject for improved type safety
```

## Commit Guidelines

### Good Commit Messages
- Start with lowercase after type prefix
- Be concise but descriptive (50 chars for title)
- Reference issue numbers when applicable: `(#123)`
- Group related changes in single commit

### Commit Scope
- One logical change per commit
- Separate formatting/refactoring from feature changes
- Include type changes with related feature changes

## Branch Naming

### Pattern
```
<type>/<short-description>
```

### Examples
```bash
feat/registry-actions-override
fix/token-expiration
chore/improve-typing
refactor/strict-mode
```

## Pull Request Standards

### Title Format
Follow same format as commits:
```
feat: Add custom actions override to registry (#225)
```

### PR Description
- Summarize the change and motivation
- List breaking changes if any
- Reference related issues

### Squash Merge
PRs are typically squash-merged, so PR title becomes the commit message. Feature branch commits can be more granular/WIP.

## Versioning

### Changelog Updates
Update `CHANGELOG.md` with notable changes:
- Breaking changes (marked clearly)
- New features
- Bug fixes
- Dependency updates

### Version Bumps
- `package.json` version updated on release
- Follow semantic versioning: `MAJOR.MINOR.PATCH`

## Automated Commits to Exclude

When analyzing patterns, exclude:
- `dependabot[bot]` commits (dependency updates)
- `chore(deps):` automated bumps
- GitHub merge commits

Focus on human-authored commits for style guidance.
