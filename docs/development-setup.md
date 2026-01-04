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

# Install dependencies
pnpm install

# Start Guillotina (see section below)
# Then start the development server
pnpm dev
```

The playground will be available at `http://127.0.0.1:5173`

## Setting up Guillotina

Guillotina is the backend that the React library connects to. You need to run both PostgreSQL and Guillotina.

### Option 1: Using Docker (Recommended)

#### 1. Start PostgreSQL

```bash
docker run -d \
    --name pg_guillotina_react \
    -e POSTGRES_DB=guillotina \
    -e POSTGRES_USER=guillotina \
    -e POSTGRES_HOST_AUTH_METHOD=trust \
    -p 127.0.0.1:5432:5432 \
    postgres:18
```

#### 2. Start Guillotina

```bash
docker run --rm -it \
    --link=pg_guillotina_react \
    -p 127.0.0.1:8080:8080 \
    -v $PWD/guillotina_example/guillotina_react_app:/app/guillotina_react_app \
    plone/guillotina:latest \
    g -c /app/guillotina_react_app/config-e2e.yaml
```

### Option 2: Local Installation

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
    --name postgres \
    -e POSTGRES_DB=guillotina \
    -e POSTGRES_USER=guillotina \
    -e POSTGRES_HOST_AUTH_METHOD=trust \
    -p 127.0.0.1:5432:5432 \
    postgres:18

# Run Guillotina
guillotina -c guillotina_example/guillotina_react_app/config.yaml
```

## Initial Setup in Guillotina

After starting Guillotina for the first time, you need to create a database and container.

### Option 1: Using GUI (Recommended for first-time setup)

Simply open the playground at `http://127.0.0.1:5173` and navigate through the UI to create the database and container.

### Option 2: Using curl commands

```bash
# Create database (if not exists)
curl -X POST http://localhost:8080/db \
    -H "Content-Type: application/json" \
    -u root:root \
    -d '{"@type": "Database", "id": "db"}'

# Create container for testing
curl -X POST http://localhost:8080/db \
    -H "Content-Type: application/json" \
    -u root:root \
    -d '{"@type": "Container", "id": "container_test", "title": "Test Container"}'
```

### Option 3: Using Guillotina populate command

The example app includes a `populate` command that creates a container with test data (users, groups, folders, and sample content):

```bash
# Using Docker (from project root)
docker run --rm \
    --link=pg_guillotina_react \
    -v $PWD/guillotina_example/guillotina_react_app:/app/guillotina_react_app \
    plone/guillotina:latest \
    g -c /app/guillotina_react_app/config-e2e.yaml populate --container_id=container

# Using local installation (after activating venv)
cd guillotina_example/guillotina_react_app
guillotina populate -c config-e2e.yaml --container_id=container
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

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start playground with HMR (Vite dev server) |
| `pnpm build` | Build the library (JS + CSS) using Vite |
| `pnpm build:playground` | Build playground for preview/testing |
| `pnpm preview` | Preview built playground (port 4173) |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright, auto-builds playground) |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |

### Running Tests

#### Unit Tests

```bash
pnpm test
```

#### E2E Tests

E2E tests require:
1. PostgreSQL running on port 5432
2. Guillotina running on port 8080
3. Playwright automatically builds and serves the playground on port 4173

```bash
# Option 1: All-in-one (from project root)
# Playwright builds playground and starts preview server automatically
pnpm test:e2e

# Option 2: Manual mode (from e2e directory)
cd e2e
pnpm install
pnpm playwright:test          # Headless mode
pnpm playwright:headed        # Headed (browser) mode
pnpm playwright:ui            # UI mode
pnpm playwright:debug         # Debug mode
```

**Note**: The Playwright config (`e2e/playwright.config.js`) includes a `webServer` that automatically builds and serves the playground, so you don't need to manually build it.

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

| Field | Value |
|-------|-------|
| Username | `root` |
| Password | `root` |

## Troubleshooting

### Port already in use

```bash
# Find process using a specific port
lsof -i :8080  # Guillotina
lsof -i :5432  # PostgreSQL
lsof -i :5173  # Vite dev server
lsof -i :4173  # Vite preview server

# Stop and remove Docker containers
docker stop pg_guillotina_react && docker rm pg_guillotina_react
docker stop postgres && docker rm postgres
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

2. Restart the TypeScript server in your IDE

3. Verify the alias is working in `playground/vite.config.ts`

### E2E tests failing

If E2E tests fail to connect:

1. **Check Guillotina is running**: `curl http://localhost:8080`
2. **Check PostgreSQL is running**: `docker ps | grep postgres`
3. **Check preview server**: Playwright should start it automatically, but verify `http://localhost:4173` is accessible
4. **Check container exists**: Make sure `container_test` exists in Guillotina (see Initial Setup section)

## Additional Resources

- [Guillotina Documentation](https://guillotina.io/docs/)
- [Contributing Guide](../CONTRIBUTING.md)
- [API Documentation](api.md)
