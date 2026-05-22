const { test, expect } = require('@playwright/test')
const {
  registerGuillotinaHooks,
  rootLogin,
  containerLogin,
  autologin,
  env,
  buildAppPath,
} = require('../utils')

registerGuillotinaHooks(test)

test.describe('test login', () => {
  test('test manual login root', async ({ page }) => {
    await rootLogin(page)
  })

  test('test manual login root to container', async ({ page }) => {
    await containerLogin(page)
  })

  test('test autologin', async ({ page, request }) => {
    await autologin(page, request)
  })

  test('test autologin in container', async ({ page, request }) => {
    await autologin(page, request, {
      username: 'default',
      password: 'default',
      apiUrl: `${env.guillotina}/${env.db}/${env.container}`,
    })
    await page.goto(buildAppPath())
    await expect(page.locator('.box > .container')).toBeVisible()
  })
})
