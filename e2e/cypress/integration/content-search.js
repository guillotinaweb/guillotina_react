import {
  ITEMS_PANELS_SELECTORS,
  CONTEXT_TOOLBAR_SELECTORS,
} from '../elements/panels-selectors'

describe('test content', function () {
  beforeEach('clear', function () {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.autologin()
    cy.visit('/db/container/')
    cy.get(ITEMS_PANELS_SELECTORS.table)
      .should('contain', 'Groups')
      .should('contain', 'Users')
  })

  it('creates a folder, item and GMI and search it', function () {
    cy.addContent('Test folder', 'test-folder', 'btnAddFolder')
    cy.addContent('second folder', 'second-folder', 'btnAddFolder')
    cy.addContent('first item', 'first-item', 'btnAddItem')
    cy.addContent('second item', 'second-item', 'btnAddItem')
    cy.addGMI('Test GMI item', 'test-gmi-item')

    cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
    cy.get(ITEMS_PANELS_SELECTORS.table)
      .find('tbody')
      .find('tr')
      .its('length')
      .should('eq', 2)

    cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Folder')
    cy.get(ITEMS_PANELS_SELECTORS.table)
      .find('tbody')
      .find('tr')
      .its('length')
      .should('eq', 2)

    cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('GMI')
    cy.get(ITEMS_PANELS_SELECTORS.table)
      .find('tbody')
      .find('tr')
      .its('length')
      .should('eq', 1)
  })
})
