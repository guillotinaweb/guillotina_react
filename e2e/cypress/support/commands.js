import { setupGuillotina, tearDownGuillotina } from './guillotina'
import '@testing-library/cypress/add-commands'

beforeEach('Setup guillotina', function () {
  setupGuillotina()
})
afterEach('Teardown guillotina', function () {
  tearDownGuillotina()
})

// Sessionstorage and Localstorage command access
Cypress.Commands.add('getSessionStorage', (key) => {
  cy.window().then((window) => window.sessionStorage.getItem(key))
})

Cypress.Commands.add('setSessionStorage', (key, value) => {
  cy.window().then((window) => {
    window.sessionStorage.setItem(key, value)
  })
})

Cypress.Commands.add('getLocalStorage', (key) => {
  cy.window().then((window) => window.localStorage.getItem(key))
})

Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((window) => {
    window.localStorage.setItem(key, value)
  })
})

Cypress.Commands.add('totalItemsInTable', (key, total) => {
  cy.get(key).find('tbody').find('tr').its('length').should('eq', total)
})
