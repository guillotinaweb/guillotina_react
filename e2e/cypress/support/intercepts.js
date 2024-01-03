Cypress.Commands.add('interceptGetObject', (path = '') => {
  cy.intercept(
    'GET',
    `${Cypress.env('GUILLOTINA')}/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
      'GUILLOTINA_CONTAINER'
    )}/${path}`
  ).as(`get-object-${path !== '' ? path : 'container_test'}`)
})

Cypress.Commands.add('interceptPostObject', (path = '') => {
  cy.intercept(
    'POST',
    `${Cypress.env('GUILLOTINA')}/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
      'GUILLOTINA_CONTAINER'
    )}/${path}`
  ).as(`post-object-${path !== '' ? path : 'container_test'}`)
})

Cypress.Commands.add('interceptDeleteObject', (path = '') => {
  cy.intercept(
    'DELETE',
    `${Cypress.env('GUILLOTINA')}/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
      'GUILLOTINA_CONTAINER'
    )}/${path}`
  ).as(`delete-object-${path !== '' ? path : 'container_test'}`)
})

Cypress.Commands.add('interceptPatchObject', (path = '') => {
  cy.intercept(
    'PATCH',
    `${Cypress.env('GUILLOTINA')}/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
      'GUILLOTINA_CONTAINER'
    )}/${path}`
  ).as(`patch-object-${path !== '' ? path : 'container_test'}`)
})
