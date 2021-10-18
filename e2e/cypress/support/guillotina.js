export function setupGuillotina() {
  const headers = {
    Authorization: 'Basic cm9vdDpyb290',
    'Content-Type': 'application/json',
  }
  const api_url = `${Cypress.env('GUILLOTINA')}/${Cypress.env('GUILLOTINA_DB')}`

  cy.request({
    method: 'POST',
    url: api_url,
    headers,
    body: { '@type': 'Container', id: Cypress.env('GUILLOTINA_CONTAINER') },
  }).then(() => console.log('container created'))

  cy.request({
    method: 'POST',
    url: `${api_url}/${Cypress.env('GUILLOTINA_CONTAINER')}/@addons`,
    headers,
    body: { id: 'dbusers' },
  }).then(() => console.log('dbusers addon added'))

  cy.request({
    method: 'POST',
    url: `${api_url}/${Cypress.env('GUILLOTINA_CONTAINER')}/groups`,
    headers,
    body: {
      '@type': 'Group',
      id: 'group_view_content',
      title: 'group_view_content',
    },
  }).then(() => console.log('group_view_content group added'))

  cy.request({
    method: 'POST',
    url: `${api_url}/${Cypress.env('GUILLOTINA_CONTAINER')}/users`,
    headers,
    body: {
      '@type': 'User',
      username: 'default',
      password: 'default',
      email: 'default@test.com',
      user_groups: ['group_view_content'],
    },
  }).then(() => console.log('default user added'))
}

export function tearDownGuillotina() {
  const headers = {
    Authorization: 'Basic cm9vdDpyb290',
    'Content-Type': 'application/json',
  }
  const api_url = `${Cypress.env('GUILLOTINA')}/${Cypress.env('GUILLOTINA_DB')}`

  cy.request({
    method: 'DELETE',
    url: `${api_url}/${Cypress.env('GUILLOTINA_CONTAINER')}/users/default`,
    headers,
  }).then(() => console.log('default user deleted'))

  cy.request({
    method: 'DELETE',
    url: `${api_url}/${Cypress.env('GUILLOTINA_CONTAINER')}/users`,
    headers,
  }).then(() => console.log('users deleted'))

  cy.request({
    method: 'DELETE',
    url: `${api_url}/${Cypress.env('GUILLOTINA_CONTAINER')}/groups`,
    headers,
  }).then(() => console.log('groups deleted'))

  cy.request({
    method: 'DELETE',
    url: `${api_url}/${Cypress.env('GUILLOTINA_CONTAINER')}`,
    headers,
  }).then(() => console.log('container deleted'))
}
