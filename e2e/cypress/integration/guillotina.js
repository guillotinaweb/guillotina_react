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
    }).then((res) => {
      console.log('Container exists')
    })
  })

  it('check root user is created', function () {
    cy.request({
      method: 'GET',
      url: `${api_url}/container/users/root`,
      headers,
    }).then((res) => {
      console.log('User exists')
    })
  })
})
