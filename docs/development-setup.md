# Development Setup

This guide will help you set up a local development environment for contributing to `@guillotinaweb/react-gmi`.

## Prerequisites

- **Node.js**: 20 or higher
- **pnpm**: 9.x (`npm install -g pnpm`)
- **Docker**: For running Guillotina and PostgreSQL

## Quick Start

```bash
# Clone the repository
git clone git@github.com:guillotinaweb/guillotina_react.git
cd guillotina_react

# Install dependencies (root + E2E package; first time also installs Playwright browsers)
pnpm install
pnpm e2e:install

# Start Guillotina + Postgres in the background (Docker Compose)
pnpm guillotina:up

# Development server (same or another terminal)
pnpm dev
```

The playground will be available at `http://127.0.0.1:5173`

## Setting up Guillotina

Guillotina is the backend the library talks to. The simplest way is **Docker Compose**: one command starts PostgreSQL and the example Guillotina app (same `Dockerfile` as CI).

### Docker Compose (recommended)

From the repository root:

```bash
pnpm guillotina:up
```

Equivalent:

```bash
docker compose -f guillotina_example/guillotina_react_app/docker-compose.yml up --build
```

- API: `http://127.0.0.1:8080`
- Postgres on the host (optional tools like `psql`): `127.0.0.1:5532` (inside Compose the hostname remains `postgres`)
- Containers run **detached** (`-d`); follow logs with `pnpm guillotina:logs` (Ctrl+C stops tailing only)
- Stop and remove containers: `pnpm guillotina:down`

After changing Python code under `guillotina_example/guillotina_react_app`, run `pnpm guillotina:up` again so the image rebuilds (or `docker compose ... up --build`).

### Local installation (without Compose)

If you prefer running Guillotina directly:

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install Guillotina
pip install guillotina

# Install the example app (optional, for testing custom types)
cd guillotina_example/guillotina_react_app
pip install -e .
cd ../..

# Start PostgreSQL (still via Docker)
docker run -d \
    --name postgres_guillotina \
    -e POSTGRES_DB=guillotina \
    -e POSTGRES_USER=guillotina \
    -e POSTGRES_HOST_AUTH_METHOD=trust \
    -p 127.0.0.1:5532:5432 \
    postgres:18

# Run Guillotina
guillotina -c guillotina_example/guillotina_react_app/config.yaml
```

## Initial Setup in Guillotina

With Docker Compose and `config.yaml`, the `**db**` application database already exists at `/db`. You only need extra steps if you use a different config or empty data volume.

### Option 1: Using GUI (first-time exploration)

Open the playground at `http://127.0.0.1:5173` and use the UI as needed.

### Option 2: Using curl commands

Only if `/db` is missing or you need an extra container:

```bash
curl -X POST http://127.0.0.1:8080/db \
    -H "Content-Type: application/json" \
    -u root:root \
    -d '{"@type": "Database", "id": "db"}'

curl -X POST http://127.0.0.1:8080/db \
    -H "Content-Type: application/json" \
    -u root:root \
    -d '{"@type": "Container", "id": "container_test", "title": "Test Container"}'
```

### Option 3: Using Guillotina populate command

The example app includes a `populate` command that creates a container with test data (users, groups, folders, and sample content):

```bash
# With Docker Compose (from project root; starts Postgres if needed, then runs populate once)
pnpm guillotina:populate

# Using local installation (after activating venv)
cd guillotina_example/guillotina_react_app
guillotina populate -c config.yaml --container_id=container
```

The populate command creates:

- A container with the specified ID
- Installs `dbusers` and `image` addons
- Creates a test group (`group_view_content`)
- Creates a test user (`default` / `default`)
- Creates a folder (`gmi_folder`)
- Creates 50 sample GMI items with various field types

This is useful for quickly setting up test data for development and testing.

## Development Workflow

### Available Scripts


| Command                    | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| `pnpm dev`                 | Start playground with HMR (Vite dev server)                          |
| `pnpm build`               | Build the library (JS + CSS) using Vite                              |
| `pnpm build:playground`    | Build playground for preview/testing                                 |
| `pnpm preview`             | Preview built playground (port 4173)                                 |
| `pnpm test`                | Run unit tests (Vitest)                                              |
| `pnpm test:e2e`            | Run E2E tests (Playwright, auto-builds playground)                   |
| `pnpm e2e:install`         | Install `e2e` deps + Playwright browsers (run after clone / updates) |
| `pnpm guillotina:up`       | Start Postgres + Guillotina (Compose, detached)                      |
| `pnpm guillotina:logs`     | Follow Compose service logs                                          |
| `pnpm guillotina:down`     | Stop Compose stack                                                   |
| `pnpm guillotina:populate` | Load sample data (`populate` in Guillotina)                          |
| `pnpm lint`                | Run ESLint                                                           |
| `pnpm format`              | Format code with Prettier                                            |


### Running Tests

#### Unit Tests

```bash
pnpm test
```

#### E2E Tests

1. **One-time (after clone or Playwright upgrade):** `pnpm e2e:install` — installs the `e2e` package and downloads Chromium (and dependencies). Without this step, tests fail with “Executable doesn't exist” for the browser.
2. **Before each run:** `pnpm guillotina:up` — keeps API at `http://127.0.0.1:8080` (same URL as the playground). Wait until `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080` prints `200`.
3. **Run tests (from repo root):** Playwright builds the playground and starts preview on `http://127.0.0.1:4173` via `webServer`.

```bash
pnpm guillotina:up
pnpm test:e2e
```

Manual mode from `e2e/` (if you already ran `pnpm install` there):

```bash
cd e2e
pnpm install
pnpm exec playwright install --with-deps   # first time only
pnpm playwright:test
```

**Note**: `e2e/playwright.config.js` uses `127.0.0.1` for the preview URL so it matches `playground/src/App.tsx` (`http://127.0.0.1:8080`) and avoids `localhost` / IPv6 mismatches.

### Building the Library

```bash
pnpm build
```

This generates:

- `dist/react-gmi.js` - CommonJS format
- `dist/react-gmi.modern.js` - ES Module format
- `dist/index.d.ts` - TypeScript declarations
- `dist/css/style.css` - Compiled styles

## Project Structure

```
guillotina_react/
├── src/guillo-gmi/     # Library source code
├── playground/          # Development app (Vite + React 19)
├── e2e/                 # Playwright E2E tests
├── examples/            # Example apps for consumers
├── docs/                # Documentation
├── vite.config.ts       # Library build config
└── package.json
```

## Default Credentials

When using the provided Guillotina configuration:


| Field    | Value  |
| -------- | ------ |
| Username | `root` |
| Password | `root` |


## Troubleshooting

### Port already in use

```bash
# Find process using a specific port
lsof -i :8080  # Guillotina
lsof -i :5532  # PostgreSQL (Compose stack)
lsof -i :5432  # Other local PostgreSQL
lsof -i :5173  # Vite dev server
lsof -i :4173  # Vite preview server

# Stop Guillotina stack (Compose)
pnpm guillotina:down
```

### CORS issues

Make sure your Guillotina config includes the development URLs in `cors.allow_origin`:

- `http://127.0.0.1:5173` or `http://localhost:5173` (dev server)
- `http://127.0.0.1:4173` or `http://localhost:4173` (preview server)

The playground is configured to use `127.0.0.1` by default, but both work.

### TypeScript errors in playground

The playground uses path aliases (`@guillotinaweb/react-gmi`) to import from the library source directly. If you see TypeScript errors:

1. Make sure you have the latest dependencies:

```bash
pnpm install
```

1. Restart the TypeScript server in your IDE
2. Verify the alias is working in `playground/vite.config.ts`

### E2E tests failing

1. **Playwright browsers**: Run `pnpm e2e:install`. Missing Chromium shows as `Executable doesn't exist` under `ms-playwright`.
2. **Guillotina**: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080` should be `200` after `pnpm guillotina:up`.
3. **Compose**: `docker ps` should list `guillotina_react_app` services.
4. **Data**: Tests create `container_test` in `beforeEach`; you do not need manual “Initial setup” for E2E when using Compose + `config.yaml`.

## Additional Resources

- [Guillotina Documentation](https://guillotina.io/docs/)
- [Contributing Guide](../CONTRIBUTING.md)
- [API Documentation](api.md)

