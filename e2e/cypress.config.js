const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return config
    },
    baseUrl: 'http://localhost:4173/?path=',
    videoUploadOnPasses: false,
    experimentalFetchPolyfill: true,
    chromeWebSecurity: false,
    env: {
      GUILLOTINA: 'http://localhost:8080',
      GUILLOTINA_DB: 'db',
      GUILLOTINA_CONTAINER: 'container_test',
    },
    retries: {
      runMode: 2,
      openMode: 1,
    },
    supportFile: 'cypress/support/index.js',
    specPattern: ['cypress/integration/**.js'],
    viewportWidth: 1536,
    viewportHeight: 960,
  },
})
