Cypress.Commands.add(
  'autologin',
  function ({ username, password, api_url } = {}) {
    const url = api_url || 'http://localhost:8080'
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
      cy.setLocalStorage('auth_expires', response.body.exp)
    })

    cy.visit('/')
    cy.get('.box > .container').should('be.visible')
  }
)
