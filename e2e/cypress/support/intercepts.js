Cypress.Commands.add('interceptSearch', (path = '') => {
  cy.intercept('GET', `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/${path}@search`).as(
    `search-${path !== '' ? path : 'container'}`
  )
})

Cypress.Commands.add('interceptCanIdo', (path = '') => {
  cy.intercept('GET', `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/${path}@canido`).as(
    `canido-${path !== '' ? path : 'container'}`
  )
})

Cypress.Commands.add('interceptAddableTypes', (path = '') => {
  cy.intercept('GET', `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/${path}@addable-types`).as(
    `addable-types-${path !== '' ? path : 'container'}`
  )
})

Cypress.Commands.add('interceptGetObject', (path = '') => {
  cy.intercept('GET', `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/${path}`).as(
    `get-object-${path !== '' ? path : 'container'}`
  )
})

Cypress.Commands.add('interceptPostObject', (path = '') => {
  cy.intercept('POST', `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/${path}`).as(
    `post-object-${path !== '' ? path : 'container'}`
  )
})

Cypress.Commands.add('interceptMoveAction', (path = '') => {
  cy.intercept('POST', `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/${path}@move`).as(
    `move-${path !== '' ? path : 'container'}`
  )
})

Cypress.Commands.add('interceptCopyAction', (path = '') => {
  cy.intercept('POST', `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/${path}@duplicate`).as(
    `copy-${path !== '' ? path : 'container'}`
  )
})
