import { CONTEXT_TOOLBAR_SELECTORS } from '../elements/panels-selectors'
import {
  FORM_BASE_SELECTORS,
  EDITABLE_FORM_SELECTORS,
  FORM_SELECTORS,
} from '../elements/form-types-selectors'

import { NOTIFICATION_SELECTOR } from '../elements/notification-selectors'

Cypress.Commands.add(
  'testInput',
  ({ fieldName, newValue, checkValue = true }) => {
    cy.get(
      `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-${fieldName}']`
    ).click()
    cy.get(
      `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-${fieldName}']`
    ).within(() => {
      cy.get(EDITABLE_FORM_SELECTORS.field).clear().type(newValue)
      cy.get(EDITABLE_FORM_SELECTORS.btnSave).click()
    })
    cy.wait('@patch-object-test-gmi-item')
    cy.get(NOTIFICATION_SELECTOR).should(
      'contain',
      `Field ${fieldName}, updated!`
    )

    if (checkValue) {
      cy.get(
        `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-${fieldName}']`
      ).contains(newValue)
    }
  }
)

Cypress.Commands.add('addContent', (name, id, selector) => {
  // Create content
  cy.get(CONTEXT_TOOLBAR_SELECTORS.btnAddType).click()
  cy.get(CONTEXT_TOOLBAR_SELECTORS[selector]).click()
  cy.get(`[data-test='title${FORM_BASE_SELECTORS.prefixField}']`).type(name)
  cy.get(`[data-test='id${FORM_BASE_SELECTORS.prefixField}']`).should(
    'have.value',
    id
  )
  cy.get(FORM_BASE_SELECTORS.btn).click()
  cy.get(NOTIFICATION_SELECTOR).should('contain', 'Content created!')
})

Cypress.Commands.add(
  'addGMI',
  ({ name, id, number = '5', choice = 'keyword' }) => {
    // Create GMI item
    cy.get(CONTEXT_TOOLBAR_SELECTORS.btnAddType).click()
    cy.get(CONTEXT_TOOLBAR_SELECTORS.btnAddGMI).click()
    cy.get(FORM_SELECTORS.containerGMI).should('contain', 'Add GMI')
    cy.get(`[data-test='title${FORM_BASE_SELECTORS.prefixField}']`).type(name)
    cy.get(`[data-test='uuid${FORM_BASE_SELECTORS.prefixField}']`).should(
      'have.value',
      id
    )
    cy.get(`[data-test='number_field${FORM_BASE_SELECTORS.prefixField}']`).type(
      number
    )
    cy.get(
      `[data-test='choice_field${FORM_BASE_SELECTORS.prefixField}']`
    ).select(choice)
    cy.get(FORM_BASE_SELECTORS.btn).click()
    cy.get(NOTIFICATION_SELECTOR).should('contain', 'Content created!')
  }
)
