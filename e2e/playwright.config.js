const { defineConfig, devices } = require('@playwright/test')

const isHeaded = process.env.HEADED === 'true' || process.env.PWDEBUG === '1'
const isCI = !!process.env.CI

module.exports = defineConfig({
  testDir: './playwright/tests',
  // GitHub runners + Dockerized API are slower; beforeEach seeds 50 GMI items per test.
  timeout: isCI ? 90000 : 30000,
  expect: { timeout: isCI ? 30000 : 20000 },
  retries: isCI ? 2 : 1,
  fullyParallel: false,
  workers: 1,
  reporter: isCI
    ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : 'list',
  use: {
    // Use 127.0.0.1 (same as playground App.tsx API URL) to avoid localhost vs IPv6 / CORS edge cases
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173',
    viewport: { width: 1536, height: 960 },
    trace: 'on-first-retry',
    // Avoid flaky "element not stable" / slow network on shared CI CPUs
    actionTimeout: isCI ? 30000 : 15000,
    navigationTimeout: isCI ? 45000 : 30000,
    // Enable headed mode via env variable or debug mode
    headless: !isHeaded,
    // Slow down actions for visual debugging
    ...(isHeaded && { launchOptions: { slowMo: 100 } }),
  },
  webServer: {
    command: 'pnpm -C .. build:playground && pnpm -C .. preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: isCI ? 180000 : 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
