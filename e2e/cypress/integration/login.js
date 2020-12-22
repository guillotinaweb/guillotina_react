describe('test login', function () {
  beforeEach('clear', function () {
    cy.clearLocalStorage()
    cy.clearCookies()
  })
  it('test manual login', function () {
    const form = '.login__form'
    const userInput = '.login__form > .field:nth-child(1) > .input'
    const passwordInput = '.login__form > .field:nth-child(2) > .input'
    const submit = '.login__form > .field > .button'

    cy.visit('/')
    cy.get(form).should('be.visible')
    cy.get(userInput).type('root').should('have.value', 'root')
    cy.get(passwordInput).type('root').should('have.value', 'root')
    cy.get(submit).click()
    cy.get(form).should('not.exist')
    cy.get('.box > .container').should('be.visible')
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
