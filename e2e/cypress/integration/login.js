import { LOGIN_SELECTORS } from '../elements/login-selectors'

describe('test login', function () {
  beforeEach('clear', function () {
    cy.clearLocalStorage()
    cy.clearCookies()
  })
  it('test manual login root', function () {
    cy.intercept('POST', `/@login`).as('login')
    cy.visit('/')
    cy.get(LOGIN_SELECTORS.form).should('be.visible')
    cy.get(LOGIN_SELECTORS.username).type('root').should('have.value', 'root')
    cy.get(LOGIN_SELECTORS.password).type('root').should('have.value', 'root')
    cy.get(LOGIN_SELECTORS.form).submit()
    cy.wait('@login')
    cy.get(LOGIN_SELECTORS.form).should('not.exist')
  })

  it('test manual login root to container', function () {
    cy.intercept('POST', `/@login`).as('login')
    cy.visit('/')
    cy.get(LOGIN_SELECTORS.form).should('be.visible')
    cy.get(LOGIN_SELECTORS.username).type('root').should('have.value', 'root')
    cy.get(LOGIN_SELECTORS.password).type('root').should('have.value', 'root')
    cy.get(LOGIN_SELECTORS.schema).select(
      `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/`
    )
    cy.get(LOGIN_SELECTORS.form).submit()
    cy.wait('@login')
    cy.get(LOGIN_SELECTORS.form).should('not.exist')
  })

  it('test autologin', function () {
    const headers = {
      'Content-Type': 'application/json',
    }

    cy.request({
      method: 'POST',
      url: `${Cypress.env('GUILLOTINA')}/@login`,
      headers,
      body: { username: 'root', password: 'root' },
    }).then((response) => {
      cy.setLocalStorage('auth', response.body.token)
      cy.setLocalStorage('auth_expires', response.body.exp)
    })

    cy.visit('/')
    cy.get('.box > .container').should('be.visible')
  })

  it('test autologin in container', function () {
    let api_url = `${Cypress.env('GUILLOTINA')}/${Cypress.env(
      'GUILLOTINA_DB'
    )}/${Cypress.env('GUILLOTINA_CONTAINER')}`
    const headers = {
      'Content-Type': 'application/json',
    }

    cy.request({
      method: 'POST',
      url: `${api_url}/@login`,
      headers,
      body: { username: 'default', password: 'default' },
    }).then((response) => {
      cy.setLocalStorage('auth', response.body.token)
      cy.setLocalStorage('auth_expires', response.body.exp)
    })

    cy.visit('/')
    cy.get('.box > .container').should('be.visible')
  })
})
