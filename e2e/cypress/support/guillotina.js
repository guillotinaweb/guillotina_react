export function setupGuillotina() {
  const headers = {
    Authorization: 'Basic cm9vdDpyb290',
    'Content-Type': 'application/json',
  };
  const api_url = 'http://localhost:8080/db';

  cy.request({
    method: 'POST',
    url: api_url,
    headers,
    body: { '@type': 'Container', id: 'container' },
  }).then(response => console.log('container created'));

  cy.request({
    method: 'POST',
    url: `${api_url}/container/@addons`,
    headers,
    body: { id: 'dbusers' },
  }).then(response => console.log('dbusers addon added'));

  cy.request({
    method: 'POST',
    url: `${api_url}/container/users`,
    headers,
    body: { 
      '@type': 'User',
      username: 'root',
      password: 'root',
      email: 'root@test.com'
    },
  }).then(response => console.log('dbusers addon added'));
}

export function tearDownGuillotina() {
  const headers = {
    Authorization: 'Basic cm9vdDpyb290',
    'Content-Type': 'application/json',
  };
  const api_url = 'http://localhost:8080/db';

  cy.request({
    method: 'DELETE',
    url: `${api_url}/container/users`,
    headers,
  }).then(response => console.log('container deleted'));

  cy.request({
    method: 'DELETE',
    url: `${api_url}/container/groups`,
    headers,
  }).then(response => console.log('container deleted'));

  cy.request({
    method: 'DELETE',
    url: `${api_url}/container`,
    headers,
  }).then(response => console.log('container deleted'));
}
