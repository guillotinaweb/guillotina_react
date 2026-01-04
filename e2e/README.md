# E2E Tests (Playwright)

End-to-end tests for `@guillotinaweb/react-gmi` using Playwright.

## Prerequisites

1. **PostgreSQL** running on port 5432
2. **Guillotina** running on port 8080
3. **Playground** built and served on port 4173

## Quick Start

From the **project root**:

```bash
# Run all E2E tests (builds playground automatically)
pnpm test:e2e
```

## Manual Setup

### 1. Start PostgreSQL

```bash
docker run -d \
    --name postgres \
    -e POSTGRES_DB=guillotina \
    -e POSTGRES_USER=guillotina \
    -e POSTGRES_HOST_AUTH_METHOD=trust \
    -p 127.0.0.1:5432:5432 \
    postgres:15
```

### 2. Start Guillotina

```bash
docker run --rm -it \
    --link=postgres \
    -p 127.0.0.1:8080:8080 \
    -v $PWD/guillotina_example/guillotina_react_app:/app/guillotina_react_app \
    plone/guillotina:latest \
    g -c /app/guillotina_react_app/config-e2e.yaml
```

### 3. Run Playwright

Playwright will build and start the preview server automatically.

```bash
cd e2e
pnpm install

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
- **baseURL**: `http://localhost:4173`
- **Guillotina API**: `http://localhost:8080`
- **Test container**: `container_test`

## Writing Tests

Playwright tests are located in `playwright/tests/`. They use:
- Utility functions in `playwright/utils.js`
- Fixtures in `playwright/fixtures/`

## Troubleshooting

### Tests failing to connect

Make sure both Guillotina and the preview server are running:
- Guillotina: http://localhost:8080
- Preview: http://localhost:4173
