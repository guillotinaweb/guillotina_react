Cypress.Commands.add('interceptSearch', (path = '') => {
  cy.intercept('GET', `/db/container/${path}@search`).as(
    `search-${path !== '' ? path : 'container'}`
  )
})

Cypress.Commands.add('interceptCanIdo', (path = '') => {
  cy.intercept('GET', `/db/container/${path}@canido`).as(`canido-${path !== '' ? path : 'container'}`)
})

Cypress.Commands.add('interceptAddableTypes', (path = '') => {
  cy.intercept('GET', `/db/container/${path}@addable-types`).as(`addable-types-${path !== '' ? path : 'container'}`)
})

Cypress.Commands.add('interceptGetObject', (path = '') => {
  cy.intercept('GET', `/db/container/${path}`).as(`get-object-${path !== '' ? path : 'container'}`)
})

Cypress.Commands.add('interceptMoveAction', (path = '') => {
  cy.intercept('POST', `/db/container/${path}@move`).as(`move-${path !== '' ? path : 'container'}`)
})

Cypress.Commands.add('interceptCopyAction', (path = '') => {
  cy.intercept('POST', `/db/container/${path}@duplicate`).as(`copy-${path !== '' ? path : 'container'}`)
})
