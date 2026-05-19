const { test, expect } = require('@playwright/test')
const {
  LOGIN_TYPES,
  ITEMS_PANELS_SELECTORS,
  EDITABLE_FORM_SELECTORS,
  FORM_SELECTORS,
  USER_FORM_SELECTORS,
  NOTIFICATION_SELECTOR,
  ACTION_SELECTORS,
  BREADCRUMB_SELECTORS,
  registerGuillotinaHooks,
  login,
  addContent,
  goToContainer,
} = require('../utils')

registerGuillotinaHooks(test)

for (const loginType of LOGIN_TYPES) {
  test.describe(`test content (${loginType})`, () => {
    test.beforeEach(async ({ page }) => {
      await login(page, loginType)
      await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
        'Groups'
      )
      await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
        'Users'
      )
    })

    test('creates a folder as Admin, then deletes it', async ({ page }) => {
      await addContent(page, 'Test folder', 'test-folder', 'btnAddFolder')

      const folderRow = page.locator(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-folder']`
      )
      await folderRow.locator(ACTION_SELECTORS.delete).click()
      await page.click(ACTION_SELECTORS.btnConfirmModal)
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Items removed!'
      )
    })

    test('creates an item as Admin, modifies it and delete it', async ({
      page,
    }) => {
      await addContent(page, 'Test Item', 'test-item', 'btnAddItem')

      await page.click(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-item']`
      )
      await page.click(
        `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-title']`
      )
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-title']`
        )
        .locator(EDITABLE_FORM_SELECTORS.field)
        .fill('Test Modified Item')
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-title']`
        )
        .locator(EDITABLE_FORM_SELECTORS.btnSave)
        .click()

      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Field title, updated!'
      )
      await goToContainer(page, loginType)

      const itemRow = page.locator(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-item']`
      )
      await itemRow.locator(ACTION_SELECTORS.delete).click()
      await page.click(ACTION_SELECTORS.btnConfirmModal)
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Items removed!'
      )
    })

    test('creates a User as Admin, modifies it and delete it', async ({
      page,
    }) => {
      await page.click(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-users']`
      )

      await page.click('.level-right > .button')
      await page.fill(USER_FORM_SELECTORS.username, 'test-user')
      await page.fill(USER_FORM_SELECTORS.email, 'test-user@test.test')
      await page.fill(USER_FORM_SELECTORS.name, 'Test Name')
      await page.fill(USER_FORM_SELECTORS.password, 'TestPassword')
      await page
        .locator(FORM_SELECTORS.containerUser)
        .locator('form')
        .evaluate((form) => form.requestSubmit())

      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Content created!'
      )

      await page.click(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-user']`
      )
      await page.fill(USER_FORM_SELECTORS.username, 'Test Modified User', {
        force: true,
      })
      await page.click(USER_FORM_SELECTORS.btnUpate)
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'User updated'
      )
      await page.click(
        `[data-test='${BREADCRUMB_SELECTORS.prefixItem}-users']`
      )

      const userRow = page.locator(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-user']`
      )
      await userRow.locator(ACTION_SELECTORS.delete).click()
      await page.click(ACTION_SELECTORS.btnConfirmModal)
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Items removed!'
      )
    })
  })
}
