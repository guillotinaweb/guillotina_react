const { test, expect } = require('@playwright/test')
const {
  LOGIN_TYPES,
  ITEMS_PANELS_SELECTORS,
  CONTEXT_TOOLBAR_SELECTORS,
  buildAppPath,
  env,
  registerGuillotinaHooks,
  login,
  addContent,
  addGMI,
  expectTableRowCount,
} = require('../utils')

registerGuillotinaHooks(test)

// Helper to select an option and wait for the search response to complete
async function selectAndWaitForSearch(page, selector, value) {
  await Promise.all([
    page.waitForResponse((response) => response.url().includes('@search')),
    page.selectOption(selector, value),
  ])
  // Wait for any loading state to settle
  await page.waitForTimeout(100)
}

// Helper to click and wait for the search response (accepts selector string or locator)
async function clickAndWaitForSearch(page, selectorOrLocator) {
  const locator =
    typeof selectorOrLocator === 'string'
      ? page.locator(selectorOrLocator)
      : selectorOrLocator
  await Promise.all([
    page.waitForResponse((response) => response.url().includes('@search')),
    locator.click(),
  ])
  // Wait for any loading state to settle
  await page.waitForTimeout(100)
}

for (const loginType of LOGIN_TYPES) {
  test.describe(`Search test (${loginType})`, () => {
    test.beforeEach(async ({ page }) => {
      await login(page, loginType)
      await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
        'Groups'
      )
      await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
        'Users'
      )
    })

    test('Creates a folder, item and GMI and search it', async ({ page }) => {
      await addContent(page, 'Test folder', 'test-folder', 'btnAddFolder')
      await addContent(page, 'second folder', 'second-folder', 'btnAddFolder')
      await addContent(page, 'first item', 'first-item', 'btnAddItem')
      await addContent(page, 'second item', 'second-item', 'btnAddItem')
      await addGMI(page, {
        name: 'Test GMI item',
        id: 'test-gmi-item',
      })

      await selectAndWaitForSearch(
        page,
        CONTEXT_TOOLBAR_SELECTORS.selectFilteType,
        'Item'
      )
      await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 2)

      await selectAndWaitForSearch(
        page,
        CONTEXT_TOOLBAR_SELECTORS.selectFilteType,
        'Folder'
      )
      // 3 folders: Test folder + second folder + GMI Folder (created by setup)
      await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 3)

      await selectAndWaitForSearch(
        page,
        CONTEXT_TOOLBAR_SELECTORS.selectFilteType,
        'GMI'
      )
      await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 1)
    })

    test('Search items in first level', async ({ page }) => {
      await addContent(page, 'First item', 'first-item', 'btnAddItem')
      await addContent(page, 'Second Item', 'second-item', 'btnAddItem')
      await addContent(page, 'Test folder', 'test-folder', 'btnAddFolder')

      await page.click(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-test-folder']`
      )
      await addContent(
        page,
        'First item in folder',
        'first-item-in-folder',
        'btnAddItem'
      )

      await page.goto(buildAppPath(`/${env.db}/${env.container}/`))
      await selectAndWaitForSearch(
        page,
        CONTEXT_TOOLBAR_SELECTORS.selectFilteType,
        'Item'
      )
      await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 2)
    })

    test('Creates 20 GMI and use the filters', async ({ page }) => {
      // Click on GMI Folder and wait for navigation/load
      await clickAndWaitForSearch(
        page,
        page.getByText('GMI Folder', { exact: true })
      )

      // Select keyword filter
      await selectAndWaitForSearch(
        page,
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixFilterItem}choice_field']`,
        'keyword'
      )
      await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 8)

      // Select date filter (this replaces keyword filter)
      await selectAndWaitForSearch(
        page,
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixFilterItem}choice_field']`,
        'date'
      )
      await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 9)

      // Remove date filter by clicking tag - wait for tag to disappear
      const dateTag = page.locator("[data-test='tag-date']")
      await Promise.all([
        page.waitForResponse((response) => response.url().includes('@search')),
        dateTag.locator('button').click(),
      ])
      await dateTag.waitFor({ state: 'hidden' })
      await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 10)

      // Select boolean_field = false
      await selectAndWaitForSearch(
        page,
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixFilterItem}boolean_field']`,
        'false'
      )
      await expect(page.locator('text=/25 items/').first()).toBeVisible()

      // Remove boolean filter by clicking tag - wait for tag to disappear
      const falseTag = page.locator("[data-test='tag-false']")
      await Promise.all([
        page.waitForResponse((response) => response.url().includes('@search')),
        falseTag.locator('button').click(),
      ])
      await falseTag.waitFor({ state: 'hidden' })
      await expect(page.locator('text=/50 items/').first()).toBeVisible()

      // Fill number field - wait for search after input
      await page.fill(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixFilterItem}number_field']`,
        '19'
      )
      // Wait for debounced search to trigger
      await page.waitForResponse((response) =>
        response.url().includes('@search')
      )
      await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 1)
    })

    test('Sort by name', async ({ page }) => {
      // Click on GMI Folder and wait for navigation/load
      await clickAndWaitForSearch(
        page,
        page.getByText('GMI Folder', { exact: true })
      )

      await expect(page.getByText('Test GMI item 0')).toHaveCount(0)

      // Click sort by title
      await clickAndWaitForSearch(
        page,
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixSortableItem}title']`
      )
      await expect(page.getByText('Test GMI item 9')).toBeVisible()

      // Click sort again to reverse
      await clickAndWaitForSearch(
        page,
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixSortableItem}title']`
      )
      await expect(page.getByText('Test GMI item 0')).toBeVisible()
    })
  })
}
