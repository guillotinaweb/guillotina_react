
import { 
  EDITABLE_FORM_SELECTORS
} from '../elements/form-types-selectors'
import { NOTIFICATION_SELECTOR } from '../elements/notification-selectors'

Cypress.Commands.add('testInput', ({
  fieldName,
  newValue,
  checkValue = true
}) => {
  cy.get(
    `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-${fieldName}']`
  ).click()
  cy.get(
    `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-${fieldName}']`
  ).within(() => {
    cy.get(EDITABLE_FORM_SELECTORS.field).clear().type(newValue)
    cy.get(EDITABLE_FORM_SELECTORS.btnSave).click()
  })
  cy.wait('@patch')
  cy.get(NOTIFICATION_SELECTOR).should('contain', `Field ${fieldName}, updated!`)

  if(checkValue){
    cy.get(
      `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-${fieldName}']`
    ).contains(newValue)
  }
})