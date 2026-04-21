# E2E Tests (Playwright)

End-to-end tests for `@guillotinaweb/react-gmi` using Playwright.

## Prerequisites

1. **Install E2E deps + browsers (first time):** from repo root, `pnpm e2e:install`
2. **Guillotina** on `http://127.0.0.1:8080`, e.g. `pnpm guillotina:up` (leave Compose running)
3. **Preview** on `http://127.0.0.1:4173` — started automatically by Playwright’s `webServer`

## Quick Start

From the **project root**:

```bash
pnpm e2e:install    # once per clone / Playwright upgrade
pnpm guillotina:up
pnpm test:e2e
```

## Manual Setup

From the **project root**, start Postgres and Guillotina (Docker Compose):

```bash
pnpm guillotina:up
```

### Run Playwright

Playwright will build and start the preview server automatically.

```bash
cd e2e
pnpm install
pnpm exec playwright install --with-deps

# Headless mode
pnpm playwright:test

# Headed (browser) mode
pnpm playwright:headed

# UI mode
pnpm playwright:ui

# Debug mode
pnpm playwright:debug
```

## Configuration

The Playwright configuration (`playwright.config.js`) uses:
- **baseURL**: `http://127.0.0.1:4173` (aligned with the playground API host)
- **Guillotina API** (in tests / `playground/src/App.tsx`): `http://127.0.0.1:8080`
- **Test container**: `container_test` (created in test hooks, not required manually)

## Writing Tests

Playwright tests are located in `playwright/tests/`. They use:
- Utility functions in `playwright/utils.js`
- Fixtures in `playwright/fixtures/`

## Troubleshooting

### Tests failing to connect

- Run `pnpm e2e:install` if you see a missing browser executable error.
- Guillotina: `http://127.0.0.1:8080`
- Preview: started by Playwright at `http://127.0.0.1:4173`
