import {
  ITEMS_PANELS_SELECTORS,
  CONTEXT_TOOLBAR_SELECTORS,
} from '../elements/panels-selectors'
import { ACTION_SELECTORS } from '../elements/actions-selectors'
import { LOGIN_TYPES } from '../elements/login-selectors'

LOGIN_TYPES.forEach((loginType) => {
  describe('Actions', function () {
    beforeEach('clear', function () {
      cy.clearLocalStorage()
      cy.clearCookies()
      cy.login(loginType)

      cy.interceptGetObject()
      cy.interceptPostObject()
      cy.interceptGetObject('@canido**')
      cy.interceptGetObject('@addable-types')
      cy.interceptGetObject('@search**')

      cy.visit(
        `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
          'GUILLOTINA_CONTAINER'
        )}/`
      )

      cy.wait('@get-object-container_test')
      cy.wait('@get-object-@canido**')
      cy.wait('@get-object-@addable-types')

      cy.get(ITEMS_PANELS_SELECTORS.table)
        .should('contain', 'Groups')
        .should('contain', 'Users')

      cy.addContent('First item', 'first-item', 'btnAddItem')
      cy.wait('@post-object-container_test')
      cy.addContent('Second Item', 'second-item', 'btnAddItem')
      cy.wait('@post-object-container_test')
      cy.addContent('Test folder', 'test-folder', 'btnAddFolder')
      cy.wait('@post-object-container_test')

      // Select Item
      cy.get(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-first-item']`
      ).within(() => {
        cy.get(ITEMS_PANELS_SELECTORS.checkboxRow).click()
      })

      cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
      cy.wait('@get-object-@search**')
      cy.get(ITEMS_PANELS_SELECTORS.table)
        .find('tbody')
        .find('tr')
        .its('length')
        .should('eq', 2)
    })

    describe('Copy items, items panel', function () {
      describe('One item', () => {
        beforeEach(function () {
          cy.interceptPostObject('first-item/@duplicate')

          cy.get(ITEMS_PANELS_SELECTORS.btnChooseAction).click()
          cy.get(ITEMS_PANELS_SELECTORS.btnCopyAction).click()
          cy.get(ACTION_SELECTORS.inputPathTree).should('have.value', '/')
        })

        it('to container, default id', () => {
          cy.get(ACTION_SELECTORS.btnConfirmModal).click()
          cy.wait('@post-object-first-item/@duplicate')

          cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
          cy.wait('@get-object-@search**')
          cy.get(ITEMS_PANELS_SELECTORS.table)
            .find('tbody')
            .find('tr')
            .its('length')
            .should('eq', 3)
        })

        it('to container, custom id', () => {
          cy.get(`[data-test=${ACTION_SELECTORS.prefixInputCopyId}-first-item]`)
            .clear()
            .type('custom-id')
          cy.get(ACTION_SELECTORS.btnConfirmModal).click()
          cy.wait('@post-object-first-item/@duplicate')

          cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
          cy.wait('@get-object-@search**')
          cy.get(ITEMS_PANELS_SELECTORS.table)
            .find('tbody')
            .find('tr')
            .its('length')
            .should('eq', 3)
          cy.get(`[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-custom-id']`)
        })

        it('One item to other folder, default id', () => {
          cy.interceptGetObject('test-folder')
          cy.interceptGetObject('test-folder/@search**')

          cy.get(ACTION_SELECTORS.inputPathTree).clear().type('/test-folder')
          cy.get(ACTION_SELECTORS.btnConfirmModal).click()
          cy.wait('@post-object-first-item/@duplicate')

          cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
          cy.wait('@get-object-@search**')
          cy.get(ITEMS_PANELS_SELECTORS.table)
            .find('tbody')
            .find('tr')
            .its('length')
            .should('eq', 2)

          cy.visit(
            `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
              'GUILLOTINA_CONTAINER'
            )}/test-folder/`
          )

          cy.wait('@get-object-test-folder')
          cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
          cy.wait('@get-object-test-folder/@search**')
          cy.get(ITEMS_PANELS_SELECTORS.table)
            .find('tbody')
            .find('tr')
            .its('length')
            .should('eq', 1)
        })
      })

      describe('Multiple items', () => {
        beforeEach(function () {
          cy.interceptPostObject('first-item/@duplicate')
          cy.interceptPostObject('second-item/@duplicate')

          // Select Item
          cy.get(
            `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-second-item']`
          ).within(() => {
            cy.get(ITEMS_PANELS_SELECTORS.checkboxRow).click()
          })

          cy.get(ITEMS_PANELS_SELECTORS.btnChooseAction).click()
          cy.get(ITEMS_PANELS_SELECTORS.btnCopyAction).click()
          cy.get(ACTION_SELECTORS.inputPathTree).should('have.value', '/')
        })

        it('Multiple items to container, one default id and other custom id', () => {
          cy.get(`[data-test=${ACTION_SELECTORS.prefixInputCopyId}-first-item]`)
            .clear()
            .type('custom-id')
          cy.get(ACTION_SELECTORS.btnConfirmModal).click()

          cy.wait('@post-object-first-item/@duplicate')
          cy.wait('@post-object-second-item/@duplicate')

          cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
          cy.wait('@get-object-@search**')
          cy.get(ITEMS_PANELS_SELECTORS.table)
            .find('tbody')
            .find('tr')
            .its('length')
            .should('eq', 4)
          cy.get(`[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-custom-id']`)
        })

        it('Multiple items to other folder, one default id and other custom id', () => {
          cy.interceptGetObject('test-folder')
          cy.interceptGetObject('test-folder/@search**')

          cy.get(ACTION_SELECTORS.inputPathTree).clear().type('/test-folder')
          cy.get(ACTION_SELECTORS.btnConfirmModal).click()

          cy.wait('@post-object-first-item/@duplicate')
          cy.wait('@post-object-second-item/@duplicate')

          cy.visit(
            `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
              'GUILLOTINA_CONTAINER'
            )}/test-folder/`
          )
          cy.wait('@get-object-test-folder')

          cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
          cy.wait('@get-object-test-folder/@search**')
          cy.get(ITEMS_PANELS_SELECTORS.table)
            .find('tbody')
            .find('tr')
            .its('length')
            .should('eq', 2)
        })
      })
    })

    describe('Move items, items panel', function () {
      beforeEach(() => {
        cy.interceptPostObject('first-item/@move')
        cy.interceptGetObject('test-folder/')
        cy.interceptGetObject('test-folder/@search**')
      })

      it('One item', () => {
        cy.get(ITEMS_PANELS_SELECTORS.btnChooseAction).click()
        cy.get(ITEMS_PANELS_SELECTORS.btnMoveAction).click()
        cy.get(ACTION_SELECTORS.inputPathTree).should('have.value', '')

        cy.get(ACTION_SELECTORS.inputPathTree).clear().type('/test-folder')
        cy.get(ACTION_SELECTORS.btnConfirmModal).click()
        cy.wait('@post-object-first-item/@move')

        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@get-object-@search**')
        cy.get(ITEMS_PANELS_SELECTORS.table)
          .find('tbody')
          .find('tr')
          .its('length')
          .should('eq', 1)

        cy.visit(
          `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
            'GUILLOTINA_CONTAINER'
          )}/test-folder/`
        )

        cy.wait('@get-object-test-folder/')
        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@get-object-test-folder/@search**')
        cy.get(ITEMS_PANELS_SELECTORS.table)
          .find('tbody')
          .find('tr')
          .its('length')
          .should('eq', 1)
      })
      it('Multiple item', () => {
        cy.interceptPostObject('second-item/@move')

        // Select Item
        cy.get(
          `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-second-item']`
        ).within(() => {
          cy.get(ITEMS_PANELS_SELECTORS.checkboxRow).click()
        })

        cy.get(ITEMS_PANELS_SELECTORS.btnChooseAction).click()
        cy.get(ITEMS_PANELS_SELECTORS.btnMoveAction).click()
        cy.get(ACTION_SELECTORS.inputPathTree).should('have.value', '')

        cy.get(ACTION_SELECTORS.inputPathTree).clear().type('/test-folder')
        cy.get(ACTION_SELECTORS.btnConfirmModal).click()

        cy.wait('@post-object-first-item/@move')
        cy.wait('@post-object-second-item/@move')

        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@get-object-@search**')
        cy.get(ITEMS_PANELS_SELECTORS.table).should('contain', 'Anything here!')

        cy.visit(
          `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env(
            'GUILLOTINA_CONTAINER'
          )}/test-folder/`
        )

        cy.wait('@get-object-test-folder/')
        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@get-object-test-folder/@search**')
        cy.get(ITEMS_PANELS_SELECTORS.table)
          .find('tbody')
          .find('tr')
          .its('length')
          .should('eq', 2)
      })
    })
  })
})
