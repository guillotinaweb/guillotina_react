import {LOGIN_SELECTORS} from '../elements/login-selectors'
import {BREADCRUMB_SELECTORS} from '../elements/breadcrumb-selectors'

describe('test login', function () {
  beforeEach('clear', function () {
    cy.clearLocalStorage()
    cy.clearCookies()
  })
  it('test manual login', function () {

    cy.visit('/')
    cy.get(LOGIN_SELECTORS.form).should('be.visible')
    cy.get(LOGIN_SELECTORS.username).type('root').should('have.value', 'root')
    cy.get(LOGIN_SELECTORS.password).type('root').should('have.value', 'root')
    cy.get(LOGIN_SELECTORS.form).submit()
    cy.get(LOGIN_SELECTORS.form).should('not.exist')
    cy.get(`[data-test='${BREADCRUMB_SELECTORS.prefixItem}-container']`).should('be.visible')
  })

  it('test autologin', function () {
    let api_url = 'http://localhost:8080'
    const headers = {
      'Content-Type': 'application/json',
    }

    cy.request({
      method: 'POST',
      url: `${api_url}/@login`,
      headers,
      body: { username: 'root', password: 'root' },
    }).then((response) => {
      cy.setLocalStorage('auth', response.body.token)
      cy.setLocalStorage('auth_expires', response.body.exp)
    })

    cy.visit('/')
    cy.get('.box > .container').should('be.visible')
  })
})
