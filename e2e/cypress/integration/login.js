describe('test login', function() {
  it('manual login', function() {
     
    const form = '.login__form'
    const userInput = '.login__form > .field:nth-child(1) > .input'
    const passwordInput = '.login__form > .field:nth-child(2) > .input'
    const submit = '.login__form > .field > .button'

    cy.visit('/')
    cy.get(form).should('be.visible')
    cy.get(userInput).type('root').should('have.value', 'root')
    cy.get(passwordInput).type('root').should('have.value', 'root')
    cy.get(submit).click()
    cy.get(form).should('not.be.visible')
  })
})