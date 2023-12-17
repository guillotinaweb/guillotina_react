const { defineConfig } = require('cypress')
const fs = require('fs')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      })
    },
    baseUrl: 'http://localhost:4173/?path=',
    video: true,
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
