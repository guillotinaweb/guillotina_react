const { defineConfig, devices } = require('@playwright/test')

const isHeaded = process.env.HEADED === 'true' || process.env.PWDEBUG === '1'

module.exports = defineConfig({
  testDir: './playwright/tests',
  timeout: 10000,
  expect: { timeout: 20000 },
  retries: process.env.CI ? 2 : 1,
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI
    ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : 'list',
  use: {
    // Use 127.0.0.1 (same as playground App.tsx API URL) to avoid localhost vs IPv6 / CORS edge cases
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173',
    viewport: { width: 1536, height: 960 },
    trace: 'on-first-retry',
    // Enable headed mode via env variable or debug mode
    headless: !isHeaded,
    // Slow down actions for visual debugging
    ...(isHeaded && { launchOptions: { slowMo: 100 } }),
  },
  webServer: {
    command: 'pnpm -C .. build:playground && pnpm -C .. preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
