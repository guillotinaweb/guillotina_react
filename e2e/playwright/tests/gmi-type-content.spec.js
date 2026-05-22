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
  addGMI,
  getFixturePath,
} = require('../utils')

registerGuillotinaHooks(test)

const EDIT_PANEL_SELECTORS = {
  btnSaveAll: "[data-test='btnSaveAllTest']",
  field: (name) => `[data-test='editForm-${name}']`,
  rowByField: (name) =>
    `.edit-form-field-row:has([data-test='editForm-${name}'])`,
}

async function openEditPanelForCreatedGMI(page, loginType) {
  await addGMI(page, {
    name: 'Test GMI edit panel',
    id: 'test-gmi-edit-panel',
    number: '5',
    choice: 'keyword',
  })

  await page.click(
    `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-gmi-edit-panel']`
  )
  await page.click(`[data-test='${TABS_PANEL_SELECTOS.prefixTabs}-edit']`)
  await expect(page.locator('.edit-form')).toBeVisible()
  await expect(page.locator(EDIT_PANEL_SELECTORS.btnSaveAll)).toBeDisabled()

  return async () => {
    await goToContainer(page, loginType)
    const gmiRow = page.locator(
      `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-gmi-edit-panel']`
    )
    await gmiRow.locator(ACTION_SELECTORS.delete).click()
    await page.click(ACTION_SELECTORS.btnConfirmModal)
    await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
      'Items removed!'
    )
  }
}

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

    test('edit panel renders usable full-form controls', async ({ page }) => {
      const cleanup = await openEditPanelForCreatedGMI(page, loginType)

      const textLineControl = page.locator(
        `${EDIT_PANEL_SELECTORS.rowByField('text_line_field')} .field-control`
      )
      const textLineInput = page.locator(
        EDIT_PANEL_SELECTORS.field('text_line_field')
      )
      await expect(textLineInput).toBeVisible()
      const inputWidthDelta = await textLineControl.evaluate((control) => {
        const input = control.querySelector('input')
        const controlWidth = Math.round(control.getBoundingClientRect().width)
        const inputWidth = Math.round(input.getBoundingClientRect().width)
        return controlWidth - inputWidth
      })
      expect(inputWidthDelta).toBe(0)

      const booleanRow = page.locator(
        EDIT_PANEL_SELECTORS.rowByField('boolean_field')
      )
      await expect(booleanRow.locator('.switch-control')).toBeVisible()
      await expect(booleanRow.locator('.switch-track')).toBeVisible()
      await expect(booleanRow.locator('input[type="checkbox"]')).toHaveClass(
        /switch-input/
      )
      await booleanRow.locator('.switch-track').click()
      await expect(booleanRow).toHaveClass(/is-modified/)

      const multipleChoiceRow = page.locator(
        EDIT_PANEL_SELECTORS.rowByField('multiple_choice_field')
      )
      await expect(multipleChoiceRow.locator('select[multiple]')).toHaveCount(0)
      await expect(
        multipleChoiceRow.locator('.multiple-choice-option')
      ).toHaveCount(6)
      await multipleChoiceRow
        .locator('.multiple-choice-option')
        .filter({ hasText: 'float' })
        .locator('label')
        .click()
      await expect(
        multipleChoiceRow
          .locator('.multiple-choice-option')
          .filter({ hasText: 'float' })
      ).toHaveClass(/is-selected/)
      await expect(multipleChoiceRow).toHaveClass(/is-modified/)

      const vocabularyChoiceRow = page.locator(
        EDIT_PANEL_SELECTORS.rowByField('multiple_choice_field_vocabulary')
      )
      await expect(vocabularyChoiceRow).not.toHaveClass(/is-modified/)

      const listRow = page.locator(EDIT_PANEL_SELECTORS.rowByField('list_field'))
      await expect(listRow).not.toHaveClass(/is-modified/)

      await expect(vocabularyChoiceRow.locator('select[multiple]')).toHaveCount(
        0
      )
      await expect(
        vocabularyChoiceRow.locator('.multiple-choice-option')
      ).toHaveCount(2)
      await vocabularyChoiceRow
        .locator('.multiple-choice-option')
        .filter({ hasText: 'Guillotina text' })
        .locator('label')
        .click()
      await expect(
        vocabularyChoiceRow
          .locator('.multiple-choice-option')
          .filter({ hasText: 'Guillotina text' })
      ).toHaveClass(/is-selected/)
      await expect(vocabularyChoiceRow).toHaveClass(/is-modified/)
      await expect(multipleChoiceRow).toHaveClass(/is-modified/)
      await expect(listRow).not.toHaveClass(/is-modified/)

      await expect(listRow.locator('.input-list')).toBeVisible()
      await expect(listRow.locator('.input-list input')).toHaveAttribute(
        'placeholder',
        'Value'
      )
      await expect(listRow.locator('.input-list-help')).toHaveText(
        'Add one value at a time.'
      )
      await expect(listRow.locator('.input-list-add button')).toBeDisabled()
      await listRow.locator('.input-list input').fill('first item')
      await expect(listRow.locator('.input-list-add button')).toBeEnabled()
      await listRow.locator('.input-list-add button').click()
      await expect(listRow.locator('.input-list-values .tag')).toContainText(
        'first item'
      )
      await expect(listRow.locator('.input-list input')).toHaveValue('')
      await expect(listRow.locator('.input-list-values .delete')).toHaveAttribute(
        'aria-label',
        'Remove first item'
      )
      await listRow.locator('.input-list input').fill('second item')
      await listRow.locator('.input-list input').press('Enter')
      await expect(listRow.locator('.input-list-values .tag')).toHaveCount(2)

      await expect(page.locator(EDIT_PANEL_SELECTORS.btnSaveAll)).toBeEnabled()
      await page.locator(EDIT_PANEL_SELECTORS.btnSaveAll).click()
      await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
        'field(s) updated successfully'
      )
      await expect(page.locator(EDIT_PANEL_SELECTORS.btnSaveAll)).toBeDisabled()

      await cleanup()
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
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-brother_gmi']`
        )
        .locator(EDITABLE_FORM_SELECTORS.btnSave)
        .click({ force: true })
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
      await page
        .locator(
          `[data-test='${EDITABLE_FORM_SELECTORS.prefixEditableField}-brother_gmi']`
        )
        .locator(EDITABLE_FORM_SELECTORS.btnSave)
        .click({ force: true })
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
        .click({ force: true })
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
        .click({ force: true })
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
        .click({ force: true })
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
        .click({ force: true })
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

      const multiImageForm = page.locator(
        "[data-test='formMultiimageOrderedAttachmentTest']"
      )
      await multiImageForm
        .locator('input[type=file]')
        .setInputFiles(getFixturePath('image_example.jpg'))
      await page.getByText('image_example.jpg').waitFor()
      await multiImageForm.getByRole('button', { name: 'Upload' }).click()
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
