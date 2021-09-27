import {
  ITEMS_PANELS_SELECTORS,
  CONTEXT_TOOLBAR_SELECTORS,
  TABS_PANEL_SELECTOS,
} from '../elements/panels-selectors'
import {
  FORM_BASE_SELECTORS,
  EDITABLE_FORM_SELECTORS,
  FORM_SELECTORS,
} from '../elements/form-types-selectors'
import { NOTIFICATION_SELECTOR } from '../elements/notification-selectors'
import { ACTION_SELECTORS } from '../elements/actions-selectors'
import { BREADCRUMB_SELECTORS } from '../elements/breadcrumb-selectors'

describe('test GMI type', function () {
  beforeEach('clear', function () {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.autologin()
    cy.visit('/db/container/')
    cy.get(ITEMS_PANELS_SELECTORS.table)
      .should('contain', 'Groups')
      .should('contain', 'Users')
  })
  it('creates a GMI item as Admin, modifies it and delete it', function () {
    cy.intercept(
      `db/container/test-gmi-item/@canido?permissions=guillotina.AddContent,guillotina.ModifyContent,guillotina.ViewContent,guillotina.DeleteContent,guillotina.AccessContent,guillotina.SeePermissions,guillotina.ChangePermissions,guillotina.MoveContent,guillotina.DuplicateContent,guillotina.ReadConfiguration,guillotina.RegisterConfigurations,guillotina.WriteConfiguration,guillotina.ManageAddons,guillotina.swagger.View`
    ).as('canido')
    cy.intercept('PATCH', `/db/container/test-gmi-item/`).as('patch')

    // Create GMI item
    cy.get(CONTEXT_TOOLBAR_SELECTORS.btnAddType).click()
    cy.get(CONTEXT_TOOLBAR_SELECTORS.btnAddGMI).click()
    cy.get(FORM_SELECTORS.containerGMI).should('contain', 'Add GMI')
    cy.get(`[data-test='title${FORM_BASE_SELECTORS.prefixField}']`).type(
      'Test GMI item'
    )
    cy.get(`[data-test='uuid${FORM_BASE_SELECTORS.prefixField}']`).should(
      'have.value',
      'test-gmi-item'
    )
    cy.get(`[data-test='number_field${FORM_BASE_SELECTORS.prefixField}']`).type(
      '5'
    )
    cy.get(
      `[data-test='choice_field${FORM_BASE_SELECTORS.prefixField}']`
    ).select('plone')
    cy.get(FORM_BASE_SELECTORS.btn).click()
    cy.get(NOTIFICATION_SELECTOR).should('contain', 'Content created!')

    // Modify Item
    cy.get(
      `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-gmi-item']`
    ).click()
    cy.wait('@canido')
    cy.get(`[data-test='${TABS_PANEL_SELECTOS.prefixTabs}-properties']`).click()

    // Modify title field ( input )
    cy.testInput({
      fieldName: 'title',
      newValue: 'Title Modified Item',
    })
    // Modify title field ( textarea )
    cy.testInput({
      fieldName: 'text_field',
      newValue: 'Text field modified',
    })
    // Modify number field
    cy.testInput({
      fieldName: 'number_field',
      newValue: '5',
    })
    // Modify datetiem field
    cy.testInput({
      fieldName: 'datetime_field',
      newValue: '2021-01-23T14:53',
      checkValue: false,
    })

    // Modify checkbox
    cy.get(
      `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-boolean_field']`
    ).click()
    cy.get(
      `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-boolean_field']`
    ).within(() => {
      cy.get(EDITABLE_FORM_SELECTORS.field).check()
      cy.get(EDITABLE_FORM_SELECTORS.btnSave).click()
    })
    cy.wait('@patch')
    cy.get(NOTIFICATION_SELECTOR).should(
      'contain',
      `Field boolean_field, updated!`
    )

    // Modify select
    cy.get(
      `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-choice_field']`
    ).click()
    cy.get(
      `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-choice_field']`
    ).within(() => {
      cy.get(EDITABLE_FORM_SELECTORS.field).select('plone')
      cy.get(EDITABLE_FORM_SELECTORS.btnSave).click()
    })
    cy.wait('@patch')
    cy.get(NOTIFICATION_SELECTOR).should(
      'contain',
      `Field choice_field, updated!`
    )

    // Modify input list
    cy.get(
      `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-list_field']`
    ).click()
    cy.get(
      `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-list_field']`
    ).within(() => {
      cy.get(EDITABLE_FORM_SELECTORS.field)
        .clear()
        .type('first item')
        .type('{enter}')
      cy.get(EDITABLE_FORM_SELECTORS.field)
        .clear()
        .type('second item')
        .type('{enter}')
      cy.get(EDITABLE_FORM_SELECTORS.btnSave).click()
    })
    cy.wait('@patch')
    cy.get(NOTIFICATION_SELECTOR).should(
      'contain',
      `Field list_field, updated!`
    )

    cy.get(`[data-test='${BREADCRUMB_SELECTORS.prefixItem}-container']`).click()

    // Delete GMI
    cy.get(
      `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-gmi-item']`
    ).within(() => {
      cy.get(ACTION_SELECTORS.delete).click()
    })
    cy.get(ACTION_SELECTORS.confirmModal).click()
    cy.get(NOTIFICATION_SELECTOR).should('contain', 'Items removed!')
  })
  it('check items column', () => {
    cy.intercept(
      `db/container/test-gmi-item/@canido?permissions=guillotina.AddContent,guillotina.ModifyContent,guillotina.ViewContent,guillotina.DeleteContent,guillotina.AccessContent,guillotina.SeePermissions,guillotina.ChangePermissions,guillotina.MoveContent,guillotina.DuplicateContent,guillotina.ReadConfiguration,guillotina.RegisterConfigurations,guillotina.WriteConfiguration,guillotina.ManageAddons,guillotina.swagger.View`
    ).as('canido')
    cy.intercept('POST', `/db/container/`).as('post')

    // Create GMI item
    cy.get(CONTEXT_TOOLBAR_SELECTORS.btnAddType).click()
    cy.get(CONTEXT_TOOLBAR_SELECTORS.btnAddGMI).click()
    cy.get(FORM_SELECTORS.containerGMI).should('contain', 'Add GMI')
    cy.get(`[data-test='title${FORM_BASE_SELECTORS.prefixField}']`).type(
      'Test GMI item'
    )
    cy.get(`[data-test='uuid${FORM_BASE_SELECTORS.prefixField}']`).should(
      'have.value',
      'test-gmi-item'
    )
    cy.get(`[data-test='number_field${FORM_BASE_SELECTORS.prefixField}']`).type(
      '5'
    )
    cy.get(
      `[data-test='choice_field${FORM_BASE_SELECTORS.prefixField}']`
    ).select('plone')
    cy.get(FORM_BASE_SELECTORS.btn).click()
    cy.wait('@post')
    cy.get(NOTIFICATION_SELECTOR).should('contain', 'Content created!')
    cy.get(ITEMS_PANELS_SELECTORS.table).should('contain', 'depth')
  })
})
