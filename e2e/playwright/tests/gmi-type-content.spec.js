const { test, expect } = require('@playwright/test')
const {
  LOGIN_TYPES,
  ITEMS_PANELS_SELECTORS,
  CONTEXT_TOOLBAR_SELECTORS,
  TABS_PANEL_SELECTOS,
  FORM_BASE_SELECTORS,
  EDITABLE_FORM_SELECTORS,
  FORM_SELECTORS,
  NOTIFICATION_SELECTOR,
  ACTION_SELECTORS,
  registerGuillotinaHooks,
  login,
  goToContainer,
  getFixturePath,
} = require('../utils')

registerGuillotinaHooks(test)

for (const loginType of LOGIN_TYPES) {
  test.describe(`test GMI type -- login type: ${loginType}`, () => {
    test.beforeEach(async ({ page }) => {
      await login(page, loginType)
      await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
        'Groups'
      )
      await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
        'Users'
      )
    })

    test('creates a GMI item as Admin, modifies it and delete it', async ({
      page,
    }) => {
      await page.click(CONTEXT_TOOLBAR_SELECTORS.btnAddType)
      await page.click(CONTEXT_TOOLBAR_SELECTORS.btnAddGMI)
      await expect(page.locator(FORM_SELECTORS.containerGMI)).toContainText(
        'Add GMI'
      )
      await page.fill(
        `[data-test='title${FORM_BASE_SELECTORS.prefixField}']`,
        'Test GMI item'
      )
      await expect(
        page.locator(`[data-test='uuid${FORM_BASE_SELECTORS.prefixField}']`)
      ).toHaveValue('test-gmi-item')
      await page.fill(
        `[data-test='number_field${FORM_BASE_SELECTORS.prefixField}']`,
        '5'
      )
      await page.selectOption(
        `[data-test='choice_field${FORM_BASE_SELECTORS.prefixField}']`,
        'keyword'
      )
      await page.click(FORM_BASE_SELECTORS.btn)
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Content created!'
      )

      await page.click(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-gmi-item']`
      )
      await page.click(
        `[data-test='${TABS_PANEL_SELECTOS.prefixTabs}-properties']`
      )

      await page.click(
        `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-brother_gmi']`
      )
      // Click search wrapper and wait for search API response
      await Promise.all([
        page.waitForResponse((response) => response.url().includes('@search')),
        page.click(`[data-test='wrapperSearchInputTest']`),
      ])
      // Wait for search results to appear and click
      await page.getByText('Test GMI item 9').click()
      await page.getByRole('button', { name: 'Save' }).click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Field brother_gmi, updated!'
      )
      await page.getByText('Test GMI item 9').click()
      await page.click(
        `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-brother_gmi']`
      )
      // Click search wrapper and wait for search API response
      await Promise.all([
        page.waitForResponse((response) => response.url().includes('@search')),
        page.click(`[data-test='wrapperSearchInputTest']`),
      ])
      // Wait for search results to appear and click
      await page.getByText('Test GMI item 6').click()
      await page.getByRole('button', { name: 'Save' }).click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Field brother_gmi, updated!'
      )

      await page.click(
        `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-multiple_choice_field']`
      )
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-multiple_choice_field']`
        )
        .locator(EDITABLE_FORM_SELECTORS.field)
        .selectOption(['float', 'integer'])
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-multiple_choice_field']`
        )
        .locator(EDITABLE_FORM_SELECTORS.btnSave)
        .click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Field multiple_choice_field, updated!'
      )

      await page.click(
        `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-multiple_choice_field_vocabulary']`
      )
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-multiple_choice_field_vocabulary']`
        )
        .locator(EDITABLE_FORM_SELECTORS.field)
        .selectOption(['plone', 'guillotina'])
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-multiple_choice_field_vocabulary']`
        )
        .locator(EDITABLE_FORM_SELECTORS.btnSave)
        .click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Field multiple_choice_field_vocabulary, updated!'
      )

      await page.click(
        `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-choice_field_vocabulary']`
      )
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-choice_field_vocabulary']`
        )
        .locator(EDITABLE_FORM_SELECTORS.field)
        .selectOption('plone')
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-choice_field_vocabulary']`
        )
        .locator(EDITABLE_FORM_SELECTORS.btnSave)
        .click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Field choice_field_vocabulary, updated!'
      )

      await page.click(
        `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-list_field']`
      )
      const listField = page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-list_field']`
        )
        .locator(EDITABLE_FORM_SELECTORS.field)
      await listField.fill('first item')
      await listField.press('Enter')
      await listField.fill('second item')
      await listField.press('Enter')
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-list_field']`
        )
        .locator(EDITABLE_FORM_SELECTORS.btnSave)
        .click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Field list_field, updated!'
      )

      await page.getByText(/Current state: Private/).waitFor()
      await page.getByText('Publish', { exact: true }).click()
      await page.getByText('Confirm', { exact: true }).click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Great status changed!'
      )
      await page.getByText(/Current state: Public/).waitFor()
      await page.getByText('Retire', { exact: true }).click()
      await page.getByText('Confirm', { exact: true }).click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Great status changed!'
      )
      await page.getByText(/Current state: Private/).waitFor()

      await page
        .locator("[data-test='formMultiimageOrderedAttachmentTest']")
        .locator('input[type=file]')
        .setInputFiles(getFixturePath('image_example.jpg'))
      await page.getByText('image_example.jpg').waitFor()
      await page.getByText('Upload', { exact: true }).click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Image uploaded!'
      )

      await goToContainer(page, loginType)

      const gmiRow = page.locator(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-gmi-item']`
      )
      await gmiRow.locator(ACTION_SELECTORS.delete).click()
      await page.click(ACTION_SELECTORS.btnConfirmModal)
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Items removed!'
      )
    })

    test('check items column', async ({ page }) => {
      await page.click(CONTEXT_TOOLBAR_SELECTORS.btnAddType)
      await page.click(CONTEXT_TOOLBAR_SELECTORS.btnAddGMI)
      await expect(page.locator(FORM_SELECTORS.containerGMI)).toContainText(
        'Add GMI'
      )
      await page.fill(
        `[data-test='title${FORM_BASE_SELECTORS.prefixField}']`,
        'Test GMI item'
      )
      await expect(
        page.locator(`[data-test='uuid${FORM_BASE_SELECTORS.prefixField}']`)
      ).toHaveValue('test-gmi-item')
      await page.fill(
        `[data-test='number_field${FORM_BASE_SELECTORS.prefixField}']`,
        '5'
      )
      await page.selectOption(
        `[data-test='choice_field${FORM_BASE_SELECTORS.prefixField}']`,
        'text'
      )
      await page.click(FORM_BASE_SELECTORS.btn)
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'Content created!'
      )
      await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
        'depth'
      )
    })
  })
}
