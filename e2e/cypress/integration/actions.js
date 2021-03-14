import { 
  ITEMS_PANELS_SELECTORS, 
  CONTEXT_TOOLBAR_SELECTORS
} from '../elements/panels-selectors'
import { 
  ACTION_SELECTORS, 
} from '../elements/actions-selectors'

describe('Actions', function() {
  beforeEach('clear', function () {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.autologin()

    cy.interceptGetObject()
    cy.interceptAddableTypes()
    cy.interceptCanIdo()
    cy.interceptSearch()

    cy.visit('/db/container/')

    cy.wait('@get-object-container')
    cy.wait('@canido-container')
    cy.wait('@addable-types-container')

    cy.get(ITEMS_PANELS_SELECTORS.table)
      .should('contain', 'Groups')
      .should('contain', 'Users')
    
    cy.addContent('First item', 'first-item', 'btnAddItem')
    cy.addContent('Second Item', 'second-item', 'btnAddItem')
    cy.addContent('Test folder', 'test-folder', 'btnAddFolder')

    // Select Item
    cy.get(`[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-first-item']`).within(() => {
      cy.get(ITEMS_PANELS_SELECTORS.checkboxRow).click()
    })

    cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
    cy.wait('@search-container')
    cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 2)
  })

  describe('Copy items, items panel', function() {

    describe('One item', () => {

      beforeEach(function() {
        cy.interceptCopyAction('first-item/')

        cy.get(ITEMS_PANELS_SELECTORS.btnChooseAction).click()
        cy.get(ITEMS_PANELS_SELECTORS.btnCopyAction).click()
        cy.get(ACTION_SELECTORS.inputPathTree).should('have.value', '/')
      })

      it('to container, default id', () => {
        cy.get(ACTION_SELECTORS.btnConfirmModal).click()
        cy.wait('@copy-first-item/')
        
        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@search-container')
        cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 3)
      })
  
      it('to container, custom id', () => {
        cy.get(`[data-test=${ACTION_SELECTORS.prefixInputCopyId}-first-item]`).clear().type('custom-id')
        cy.get(ACTION_SELECTORS.btnConfirmModal).click()
        cy.wait('@copy-first-item/')
        
        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@search-container')
        cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 3)
        cy.get(`[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-custom-id']`)
      })
  
      it('One item to other folder, default id', () => {
        cy.interceptGetObject('test-folder')
        cy.interceptSearch('test-folder/')
  
        cy.get(ACTION_SELECTORS.inputPathTree).clear().type('/test-folder')
        cy.get(ACTION_SELECTORS.btnConfirmModal).click()
        cy.wait('@copy-first-item/')
        
        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@search-container')
        cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 2)
  
        cy.visit('/db/container/test-folder/')
        
        cy.wait('@get-object-test-folder')
        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@search-test-folder/')
        cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 1)
  
      })
  
    })

    describe('Multiple items', () => {
      beforeEach(function() {
        cy.interceptCopyAction('first-item/')
        cy.interceptCopyAction('second-item/')

        // Select Item
        cy.get(`[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-second-item']`).within(() => {
          cy.get(ITEMS_PANELS_SELECTORS.checkboxRow).click()
        })

        cy.get(ITEMS_PANELS_SELECTORS.btnChooseAction).click()
        cy.get(ITEMS_PANELS_SELECTORS.btnCopyAction).click()
        cy.get(ACTION_SELECTORS.inputPathTree).should('have.value', '/')
      })

      it('Multiple items to container, one default id and other custom id', () => {
        cy.get(`[data-test=${ACTION_SELECTORS.prefixInputCopyId}-first-item]`).clear().type('custom-id')
        cy.get(ACTION_SELECTORS.btnConfirmModal).click()

        cy.wait('@copy-first-item/')
        cy.wait('@copy-second-item/')
        
        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@search-container')
        cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 4)
        cy.get(`[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-custom-id']`)
      })

      it('Multiple items to other folder, one default id and other custom id', () => {
        cy.interceptGetObject('test-folder')
        cy.interceptSearch('test-folder/')
  
        cy.get(ACTION_SELECTORS.inputPathTree).clear().type('/test-folder')
        cy.get(ACTION_SELECTORS.btnConfirmModal).click()

        cy.wait('@copy-first-item/')
        cy.wait('@copy-second-item/')
        
        cy.visit('/db/container/test-folder/')
        cy.wait('@get-object-test-folder')
  
        cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
        cy.wait('@search-test-folder/')
        cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 2)
      })

    })
  })

  describe('Move items, items panel', function() {
    beforeEach(() => {
      cy.interceptMoveAction('first-item/')
      cy.interceptGetObject('test-folder/')
      cy.interceptSearch('test-folder/')
    })

    it('One item', () => {
      cy.get(ITEMS_PANELS_SELECTORS.btnChooseAction).click()
      cy.get(ITEMS_PANELS_SELECTORS.btnMoveAction).click()
      cy.get(ACTION_SELECTORS.inputPathTree).should('have.value', '')
      
      cy.get(ACTION_SELECTORS.inputPathTree).clear().type('/test-folder')
      cy.get(ACTION_SELECTORS.btnConfirmModal).click()
      cy.wait('@move-first-item/')

      cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
      cy.wait('@search-container')
      cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 1)

      cy.visit('/db/container/test-folder/')
        
      cy.wait('@get-object-test-folder/')
      cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
      cy.wait('@search-test-folder/')
      cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 1)


    })
    it('Multiple item', () => {
      cy.interceptMoveAction('second-item/')

      // Select Item
      cy.get(`[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-second-item']`).within(() => {
        cy.get(ITEMS_PANELS_SELECTORS.checkboxRow).click()
      })

      cy.get(ITEMS_PANELS_SELECTORS.btnChooseAction).click()
      cy.get(ITEMS_PANELS_SELECTORS.btnMoveAction).click()
      cy.get(ACTION_SELECTORS.inputPathTree).should('have.value', '')
      
      cy.get(ACTION_SELECTORS.inputPathTree).clear().type('/test-folder')
      cy.get(ACTION_SELECTORS.btnConfirmModal).click()

      cy.wait('@move-first-item/')
      cy.wait('@move-second-item/')
      
      cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
      cy.wait('@search-container')
      cy.get(ITEMS_PANELS_SELECTORS.table).should('contain',"Anything here!")

      cy.visit('/db/container/test-folder/')
        
      cy.wait('@get-object-test-folder/')
      cy.get(CONTEXT_TOOLBAR_SELECTORS.selectFilteType).select('Item')
      cy.wait('@search-test-folder/')
      cy.get(ITEMS_PANELS_SELECTORS.table).find('tbody').find('tr').its('length').should('eq', 2)

    })
  })

})