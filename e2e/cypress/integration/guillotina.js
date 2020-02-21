describe('get container', function() {

  const api_url = 'http://localhost:8080/db'
  const headers = {
    Authorization: 'Basic cm9vdDpyb290',
    'Content-Type': 'application/json',
  }

  it('should 200', function() {
    cy.request({
      method: 'GET',
      url: api_url,
      headers
    }).then( res => { console.log('Container exists')})
  })

  it('should 200', function() {
    cy.request({
      method: 'GET',
      url: `${api_url}/container/users/root`,
      headers
    }).then( res => { console.log('Container exists')})
  })
})