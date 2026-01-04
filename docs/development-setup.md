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

The playground will be available at `http://localhost:5173`

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
    postgres:15

# Run Guillotina
g -c guillotina_example/guillotina_react_app/config.yaml
```

## Initial Setup in Guillotina

After starting Guillotina for the first time, you need to create a database and container:

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

Or simply open the playground and navigate through the UI to create them.

## Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start playground with HMR |
| `pnpm build` | Build the library (JS + CSS) |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |

### Running Tests

#### Unit Tests

```bash
pnpm test
```

#### E2E Tests

E2E tests require:
1. PostgreSQL running
2. Guillotina running
3. Playground built and in preview mode

```bash
# Option 1: All-in-one (Playwright builds playground automatically)
pnpm test:e2e

# Option 2: Manual mode
cd e2e
pnpm install
pnpm playwright:test          # Headless mode
pnpm playwright:headed        # Headed (browser) mode
pnpm playwright:ui            # UI mode
pnpm playwright:debug         # Debug mode
```

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
# Find process using port 8080
lsof -i :8080

# Kill PostgreSQL container
docker stop postgres && docker rm postgres
```

### CORS issues

Make sure your Guillotina config includes the development URLs in `cors.allow_origin`:
- `http://localhost:5173` (dev server)
- `http://localhost:4173` (preview server)

### TypeScript errors in playground

The playground uses path aliases to import from the library source. Make sure you have the latest dependencies:

```bash
pnpm install
```

## Additional Resources

- [Guillotina Documentation](https://guillotina.io/docs/)
- [Contributing Guide](../CONTRIBUTING.md)
- [API Documentation](api.md)
