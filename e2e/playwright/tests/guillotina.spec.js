const { test, expect } = require('@playwright/test')
const { apiBase, env, registerGuillotinaHooks } = require('../utils')

registerGuillotinaHooks(test)

test.describe('check guillotina', () => {
  const headers = {
    Authorization: 'Basic cm9vdDpyb290',
    'Content-Type': 'application/json',
  }

  test('check container is created', async ({ request }) => {
    const response = await request.get(apiBase, { headers })
    expect(response.ok()).toBeTruthy()
  })

  test('check default is created', async ({ request }) => {
    const response = await request.get(
      `${apiBase}/${env.container}/users/default`,
      { headers }
    )
    expect(response.ok()).toBeTruthy()
  })
})
