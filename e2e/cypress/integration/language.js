import { ITEMS_PANELS_SELECTORS } from '../elements/panels-selectors'

describe('check languages', function () {
  beforeEach('clear', function () {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('Check eng language', function () {
    cy.containerLogin()
    cy.findAllByText('Addons').click()
    cy.findAllByText('Install')
    cy.findAllByText('Remove')
    cy.findAllByText('Available Addons')
    cy.findAllByText('Installed Addons')
    cy.findAllByText('Actions').click()
    cy.findAllByText('Delete')
    cy.findAllByText('Move to...')
    cy.findAllByText('Copy to...')
  })

  it('Check ca language', function () {
    cy.containerLogin({
      language: 'ca',
    })
    cy.findAllByText('Addons').click()
    cy.findAllByText('Instal·la')
    cy.findAllByText('Elimina')
    cy.findAllByText('Addons Disponibles')
    cy.findAllByText('Addons Instal·lats')

    cy.findAllByText('Actions').click()
    cy.findAllByText('Elimina')
    cy.findAllByText('Mou a...')
    cy.findAllByText('Copia a...')
  })

  it('Check es language', function () {
    cy.containerLogin({
      language: 'es',
    })
    cy.findAllByText('Addons').click()
    cy.findAllByText('Instalar')
    cy.findAllByText('Eliminar')
    cy.findAllByText('Complementos Disponibles')
    cy.findAllByText('Complementos Instalados')

    cy.findAllByText('Actions').click()
    cy.findAllByText('Eliminar')
    cy.findAllByText('Mover a...')
    cy.findAllByText('Copiar a...')
  })
})
