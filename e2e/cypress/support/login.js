import { LOGIN_SELECTORS } from '../elements/login-selectors'
import { BREADCRUMB_SELECTORS } from '../elements/breadcrumb-selectors'

Cypress.Commands.add(
  'autologin',
  function ({ username, password, api_url } = {}) {
    const url = api_url || Cypress.env('GUILLOTINA')
    const user = username || 'root'
    const pw = password || 'root'
    const headers = {
      'Content-Type': 'application/json',
    }

    cy.request({
      method: 'POST',
      url: `${url}/@login`,
      headers,
      body: { username: user, password: pw },
    }).then((response) => {
      cy.setLocalStorage('auth', response.body.token)
      cy.setLocalStorage('auth_expires', new Date(response.body.exp).getTime())
    })

    cy.visit('/')
    cy.get('.box > .container').should('be.visible')
  }
)

Cypress.Commands.add('login', function (type) {
  if (type === 'root') {
    cy.rootLogin()
  } else {
    cy.containerLogin()
  }
})

Cypress.Commands.add('goToContainer', function (type) {
  if (type === 'root') {
    cy.get(
      `[data-test='${BREADCRUMB_SELECTORS.prefixItem}-container_test']`
    ).click()
  } else {
    cy.get(`[data-test='${BREADCRUMB_SELECTORS.prefixItem}-home']`).click()
  }
})

Cypress.Commands.add(
  'rootLogin',
  function ({ username, password, api_url } = {}) {
    cy.intercept('POST', `/@login`).as('login')
    const user = username || 'root'
    const pw = password || 'root'

    cy.visit('/')
    cy.get(LOGIN_SELECTORS.form).should('be.visible')
    cy.get(LOGIN_SELECTORS.username).type(user).should('have.value', user)
    cy.get(LOGIN_SELECTORS.password).type(pw).should('have.value', pw)
    cy.get(LOGIN_SELECTORS.form).submit()
    cy.wait('@login')
    cy.get(LOGIN_SELECTORS.form).should('not.exist')
    cy.visit(
      `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/`
    )
  }
)

Cypress.Commands.add(
  'containerLogin',
  function ({ username, password, api_url } = {}) {
    cy.intercept('POST', `/@login`).as('login')
    const url = api_url || Cypress.env('GUILLOTINA')
    const user = username || 'root'
    const pw = password || 'root'

    cy.interceptPostObject('@login')
    cy.visit('/')
    cy.get(LOGIN_SELECTORS.form).should('be.visible')
    cy.get(LOGIN_SELECTORS.username).type('root').should('have.value', 'root')
    cy.get(LOGIN_SELECTORS.password).type('root').should('have.value', 'root')
    cy.get(LOGIN_SELECTORS.schema).select(
      `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/`
    )
    cy.get(LOGIN_SELECTORS.form).submit()
    cy.wait('@post-object-@login')
    cy.get(LOGIN_SELECTORS.form).should('not.exist')
  }
)
