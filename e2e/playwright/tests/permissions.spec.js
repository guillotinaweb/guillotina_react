const { test, expect } = require('@playwright/test')
const {
  LOGIN_TYPES,
  TABS_PANEL_SELECTOS,
  PERMISSIONS_SELECTORS,
  NOTIFICATION_SELECTOR,
  LOGIN_SELECTORS,
  registerGuillotinaHooks,
  env,
  buildAppPath,
  containerPath,
} = require('../utils')

registerGuillotinaHooks(test)

// Helper to logout and wait for login form
async function logout(page) {
  await page.getByRole('button', { name: 'Logout' }).click()
  // Wait for login form to appear after logout
  await page.locator(LOGIN_SELECTORS.form).waitFor({ state: 'visible' })
}

// Helper to fill login form and submit (no navigation)
async function submitLogin(
  page,
  { username = 'root', password = 'root', schema = null } = {}
) {
  await page.fill(LOGIN_SELECTORS.username, username)
  await page.fill(LOGIN_SELECTORS.password, password)
  if (schema) {
    await page.selectOption(LOGIN_SELECTORS.schema, schema)
  }
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/@login')
    ),
    page.click(LOGIN_SELECTORS.btnSubmit),
  ])
  // Wait for login form to disappear
  await expect(page.locator(LOGIN_SELECTORS.form)).toHaveCount(0)
}

for (const loginType of LOGIN_TYPES) {
  test.describe(`Permissions tests (${loginType})`, () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to app and login as 'default' user (who has no permissions initially)
      await page.goto(buildAppPath())
      await expect(page.locator(LOGIN_SELECTORS.form)).toBeVisible()
      await submitLogin(page, {
        username: 'default',
        password: 'default',
        schema: `${containerPath}/`,
      })
      // Navigate to container path to verify 'Not Allowed' appears
      await page.goto(buildAppPath(`/${env.db}/${env.container}/`))
      await page.getByText('Not Allowed').waitFor()

      // Logout (click button, wait for login form)
      await logout(page)

      // Login as admin
      if (loginType === 'root') {
        await submitLogin(page)
      } else {
        await submitLogin(page, { schema: `${containerPath}/` })
      }

      // Navigate to container path
      await page.goto(buildAppPath(`/${env.db}/${env.container}/`))

      // Click permissions tab and wait for the sharing/permissions data to load
      await Promise.all([
        page.waitForResponse((response) => response.url().includes('@sharing')),
        page.click(
          `[data-test='${TABS_PANEL_SELECTOS.prefixTabs}-permissions']`
        ),
      ])
      // Wait for permissions form to be ready
      await expect(
        page.locator(PERMISSIONS_SELECTORS.selectPermissionType)
      ).toBeVisible()
    })

    test('Principal - permission tab, set permissions to user', async ({
      page,
    }) => {
      await page.selectOption(
        PERMISSIONS_SELECTORS.selectPermissionType,
        'Principal Permissions'
      )
      await page.selectOption(PERMISSIONS_SELECTORS.selectPrincipal, 'default')
      await page.selectOption(PERMISSIONS_SELECTORS.selectPermissions, [
        'guillotina.ViewContent',
        'guillotina.AccessContent',
        'guillotina.SearchContent',
      ])

      await page.selectOption(
        PERMISSIONS_SELECTORS.operationPermissions,
        'Allow'
      )
      // Click submit and wait for the POST response
      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes('@sharing') &&
            response.request().method() === 'POST'
        ),
        page.click(PERMISSIONS_SELECTORS.btnSubmitPermissions),
      ])
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Permission updated!'
      )

      const info = page.locator(PERMISSIONS_SELECTORS.containerPermissionsInfo)
      await expect(info).toContainText('guillotina.ViewContent')
      await expect(info).toContainText('guillotina.AccessContent')
      await expect(info).toContainText('guillotina.SearchContent')
      await expect(info).toContainText('default')

      // Logout and login as default user to verify permissions work
      await logout(page)
      await submitLogin(page, {
        username: 'default',
        password: 'default',
        schema: `${containerPath}/`,
      })

      await expect(page.getByText('Groups')).toBeVisible()
      await expect(page.getByText('Users')).toBeVisible()
    })

    test('Principal - role tab, set roles to group', async ({ page }) => {
      await page.selectOption(
        PERMISSIONS_SELECTORS.selectPermissionType,
        'Principal Roles'
      )
      await page.selectOption(
        PERMISSIONS_SELECTORS.selectPrincipal,
        'group_view_content'
      )
      await page.selectOption(PERMISSIONS_SELECTORS.selectRole, [
        'guillotina.Reader',
        'guillotina.Editor',
      ])
      await page.selectOption(
        PERMISSIONS_SELECTORS.operationPermissions,
        'Allow'
      )
      // Click submit and wait for the POST response
      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes('@sharing') &&
            response.request().method() === 'POST'
        ),
        page.click(PERMISSIONS_SELECTORS.btnSubmitPermissions),
      ])
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Permission updated!'
      )

      const info = page.locator(PERMISSIONS_SELECTORS.containerPermissionsInfo)
      await expect(info).toContainText('guillotina.Reader')
      await expect(info).toContainText('guillotina.Editor')
      await expect(info).toContainText('group_view_content')

      // Logout and login as default user to verify permissions work
      await logout(page)
      await submitLogin(page, {
        username: 'default',
        password: 'default',
        schema: `${containerPath}/`,
      })

      await expect(page.getByText('Groups')).toBeVisible()
      await expect(page.getByText('Users')).toBeVisible()
    })

    test('Role - permission tab ', async ({ page }) => {
      await page.selectOption(
        PERMISSIONS_SELECTORS.selectPermissionType,
        'Role Permissions'
      )
      await page.selectOption(PERMISSIONS_SELECTORS.selectRole, [
        'guillotina.Reader',
      ])
      await page.selectOption(PERMISSIONS_SELECTORS.selectPermissions, [
        'guillotina.SearchContent',
      ])
      await page.selectOption(
        PERMISSIONS_SELECTORS.operationPermissions,
        'Allow'
      )
      // Click submit and wait for the POST response
      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes('@sharing') &&
            response.request().method() === 'POST'
        ),
        page.click(PERMISSIONS_SELECTORS.btnSubmitPermissions),
      ])
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Permission updated!'
      )
      const info = page.locator(PERMISSIONS_SELECTORS.containerPermissionsInfo)
      await expect(info).toContainText('guillotina.Reader')
      await expect(info).toContainText('guillotina.SearchContent')
    })
  })
}
