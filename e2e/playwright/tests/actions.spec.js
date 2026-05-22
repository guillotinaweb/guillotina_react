const { test, expect } = require('@playwright/test')
const {
  LOGIN_TYPES,
  ACTION_SELECTORS,
  ITEMS_PANELS_SELECTORS,
  CONTEXT_TOOLBAR_SELECTORS,
  buildAppPath,
  env,
  registerGuillotinaHooks,
  login,
  addContent,
  expectTableRowCount,
} = require('../utils')

registerGuillotinaHooks(test)

for (const loginType of LOGIN_TYPES) {
  test.describe(`Actions (${loginType})`, () => {
    test.beforeEach(async ({ page }) => {
      await login(page, loginType)

      await page.goto(buildAppPath(`/${env.db}/${env.container}/`))
      await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
        'Groups'
      )
      await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
        'Users'
      )

      await addContent(page, 'First item', 'first-item', 'btnAddItem')
      await addContent(page, 'Second Item', 'second-item', 'btnAddItem')
      await addContent(page, 'Test folder', 'test-folder', 'btnAddFolder')

      const firstItemRow = page.locator(
        `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-first-item']`
      )
      await firstItemRow.locator(ITEMS_PANELS_SELECTORS.checkboxRow).click()

      await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes('/@search')
        ),
        page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
      ])
      await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 2)
    })

    test.describe('Copy items, items panel', () => {
      test.describe('One item', () => {
        test.beforeEach(async ({ page }) => {
          await page.click(ITEMS_PANELS_SELECTORS.btnChooseAction)
          await page.click(ITEMS_PANELS_SELECTORS.btnCopyAction)
          await expect(page.locator(ACTION_SELECTORS.inputPathTree)).toHaveValue(
            '/'
          )
        })

        test('to container, default id', async ({ page }) => {
          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('first-item/@duplicate')
            ),
            page.click(ACTION_SELECTORS.btnConfirmModal),
          ])

          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('/@search')
            ),
            page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
          ])
          await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 3)
        })

        test('to container, custom id', async ({ page }) => {
          await page.fill(
            `[data-test=${ACTION_SELECTORS.prefixInputCopyId}-first-item]`,
            'custom-id'
          )

          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('first-item/@duplicate')
            ),
            page.click(ACTION_SELECTORS.btnConfirmModal),
          ])

          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('/@search')
            ),
            page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
          ])
          await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 3)
          await expect(
            page.locator(
              `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-custom-id']`
            )
          ).toBeVisible()
        })

        test('One item to other folder, default id', async ({ page }) => {
          await page.fill(ACTION_SELECTORS.inputPathTree, '/test-folder')
          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('first-item/@duplicate')
            ),
            page.click(ACTION_SELECTORS.btnConfirmModal),
          ])

          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('/@search')
            ),
            page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
          ])
          await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 2)

          await page.goto(
            buildAppPath(
              `/${env.db}/${env.container}/test-folder/`
            )
          )

          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('/@search')
            ),
            page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
          ])
          await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 1)
        })
      })

      test.describe('Multiple items', () => {
        test.beforeEach(async ({ page }) => {
          const secondItemRow = page.locator(
            `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-second-item']`
          )
          await secondItemRow
            .locator(ITEMS_PANELS_SELECTORS.checkboxRow)
            .click()

          await page.click(ITEMS_PANELS_SELECTORS.btnChooseAction)
          await page.click(ITEMS_PANELS_SELECTORS.btnCopyAction)
          await expect(page.locator(ACTION_SELECTORS.inputPathTree)).toHaveValue(
            '/'
          )
        })

        test('Multiple items to container, one default id and other custom id', async ({
          page,
        }) => {
          await page.fill(
            `[data-test=${ACTION_SELECTORS.prefixInputCopyId}-first-item]`,
            'custom-id'
          )
          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('first-item/@duplicate')
            ),
            page.waitForResponse((response) =>
              response.url().includes('second-item/@duplicate')
            ),
            page.click(ACTION_SELECTORS.btnConfirmModal),
          ])

          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('/@search')
            ),
            page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
          ])
          await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 4)
          await expect(
            page.locator(
              `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-custom-id']`
            )
          ).toBeVisible()
        })

        test('Multiple items to other folder, one default id and other custom id', async ({
          page,
        }) => {
          await page.fill(ACTION_SELECTORS.inputPathTree, '/test-folder')

          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('first-item/@duplicate')
            ),
            page.waitForResponse((response) =>
              response.url().includes('second-item/@duplicate')
            ),
            page.click(ACTION_SELECTORS.btnConfirmModal),
          ])

          await page.goto(
            buildAppPath(
              `/${env.db}/${env.container}/test-folder/`
            )
          )
          await Promise.all([
            page.waitForResponse((response) =>
              response.url().includes('/@search')
            ),
            page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
          ])
          await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 2)
        })
      })
    })

    test.describe('Move items, items panel', () => {
      test('One item', async ({ page }) => {
        await page.click(ITEMS_PANELS_SELECTORS.btnChooseAction)
        await page.click(ITEMS_PANELS_SELECTORS.btnMoveAction)
        await expect(page.locator(ACTION_SELECTORS.inputPathTree)).toHaveValue('')

        await page.fill(ACTION_SELECTORS.inputPathTree, '/test-folder')
        await Promise.all([
          page.waitForResponse((response) =>
            response.url().includes('first-item/@move')
          ),
          page.click(ACTION_SELECTORS.btnConfirmModal),
        ])

        await Promise.all([
          page.waitForResponse((response) =>
            response.url().includes('/@search')
          ),
          page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
        ])
        await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 1)

        await page.goto(
          buildAppPath(
            `/${env.db}/${env.container}/test-folder/`
          )
        )
        await Promise.all([
          page.waitForResponse((response) =>
            response.url().includes('/@search')
          ),
          page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
        ])
        await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 1)
      })

      test('Multiple item', async ({ page }) => {
        const secondItemRow = page.locator(
          `[data-test='${ITEMS_PANELS_SELECTORS.prefixItem}-second-item']`
        )
        await secondItemRow
          .locator(ITEMS_PANELS_SELECTORS.checkboxRow)
          .click()

        await page.click(ITEMS_PANELS_SELECTORS.btnChooseAction)
        await page.click(ITEMS_PANELS_SELECTORS.btnMoveAction)
        await expect(page.locator(ACTION_SELECTORS.inputPathTree)).toHaveValue('')

        await page.fill(ACTION_SELECTORS.inputPathTree, '/test-folder')
        await Promise.all([
          page.waitForResponse((response) =>
            response.url().includes('first-item/@move')
          ),
          page.waitForResponse((response) =>
            response.url().includes('second-item/@move')
          ),
          page.click(ACTION_SELECTORS.btnConfirmModal),
        ])

        await Promise.all([
          page.waitForResponse((response) =>
            response.url().includes('/@search')
          ),
          page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
        ])
        await expect(page.locator(ITEMS_PANELS_SELECTORS.table)).toContainText(
          'No results'
        )

        await page.goto(
          buildAppPath(
            `/${env.db}/${env.container}/test-folder/`
          )
        )
        await Promise.all([
          page.waitForResponse((response) =>
            response.url().includes('/@search')
          ),
          page.selectOption(CONTEXT_TOOLBAR_SELECTORS.selectFilteType, 'Item'),
        ])
        await expectTableRowCount(page, ITEMS_PANELS_SELECTORS.table, 2)
      })
    })
  })
}
