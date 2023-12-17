describe('check guillotina', function () {
  const api_url = 'http://localhost:8080/db'
  const headers = {
    Authorization: 'Basic cm9vdDpyb290',
    'Content-Type': 'application/json',
  }

  it('check container is created', function () {
    cy.request({
      method: 'GET',
      url: api_url,
      headers,
    }).then(() => {
      console.log('Container exists')
    })
  })

  it('check default is created', function () {
    cy.request({
      method: 'GET',
      url: `${api_url}/container_test/users/default`,
      headers,
    }).then(() => {
      console.log('User exists')
    })
  })
})
