import {
  ITEMS_PANELS_SELECTORS,
  CONTEXT_TOOLBAR_SELECTORS,
} from '../elements/panels-selectors'
import { LOGIN_TYPES } from '../elements/login-selectors'

LOGIN_TYPES.forEach((loginType) => {
  describe('Search test', function () {
    beforeEach('clear', function () {
      cy.clearLocalStorage()
      cy.clearCookies()
      cy.login(loginType)

      cy.interceptGetObject('@addable-types')

      cy.get(ITEMS_PANELS_SELECTORS.table)
        .should('contain', 'Groups')
        .should('contain', 'Users')
    })

    it('Creates a folder, item and GMI and search it', function () {
      cy.addContent('Test folder', 'test-folder', 'btnAddFolder')
      cy.addContent('second folder', 'second-folder', 'btnAddFolder')
      cy.addContent('first item', 'first-item', 'btnAddItem')
      cy.addContent('second item', 'second-item', 'btnAddItem')
      cy.addGMI({
        name: 'Test GMI item',
        id: 'test-gmi-item',
      })

      cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
      cy.totalItemsInTable(ITEMS_PANELS_SELECTORS.table, 2)

      cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Folder')
      cy.totalItemsInTable(ITEMS_PANELS_SELECTORS.table, 2)

      cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('GMI')
      cy.totalItemsInTable(ITEMS_PANELS_SELECTORS.table, 1)
    })

    it('Search items in first level', () => {
      cy.interceptGetObject('test-folder')
      cy.interceptGetObject('@search**')

      cy.wait('@get-object-@addable-types')

      cy.addContent('First item', 'first-item', 'btnAddItem')
      cy.addContent('Second Item', 'second-item', 'btnAddItem')
      cy.addContent('Test folder', 'test-folder', 'btnAddFolder')

      cy.get(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-folder']`
      ).click()
      cy.wait('@get-object-test-folder')
      cy.addContent(
        'First item in folder',
        'first-item-in-folder',
        'btnAddItem'
      )

      cy.visit(
        `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
          'GUILLOTINA_CONTAINER'
        )}/`
      )
      cy.wait('@get-object-@addable-types')

      cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
      cy.wait('@get-object-@search**')
      cy.totalItemsInTable(ITEMS_PANELS_SELECTORS.table, 2)
    })

    it('Creates 20 GMI and use the filters', () => {
      cy.findByText('GMI Folder').click()
      cy.get(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixFilterItem}choice_field']`
      ).select('keyword')
      cy.totalItemsInTable(ITEMS_PANELS_SELECTORS.table, 8)

      cy.get(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixFilterItem}choice_field']`
      ).select('date')

      cy.totalItemsInTable(ITEMS_PANELS_SELECTORS.table, 9)
      cy.get(`[data-test='tag-date']`).find('button').click()
      cy.totalItemsInTable(ITEMS_PANELS_SELECTORS.table, 10)
      cy.get(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixFilterItem}boolean_field']`
      ).select('false')
      cy.findAllByText('25 items', { exact: false })
      cy.get(`[data-test='tag-false']`).find('button').click()
      cy.findAllByText('50 items', { exact: false })
      cy.get(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixFilterItem}number_field']`
      )
        .clear()
        .type('19')
      cy.totalItemsInTable(ITEMS_PANELS_SELECTORS.table, 1)
    })

    it('Sort by name', () => {
      cy.findByText('GMI Folder').click()
      cy.findByText('Test GMI item 0').should('not.exist')
      cy.get(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixSortableItem}title']`
      ).click()
      cy.findByText('Test GMI item 9').should('exist')
      cy.get(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixSortableItem}title']`
      ).click()
      cy.findByText('Test GMI item 0').should('exist')
    })
  })
})
