const path = require('path')
const { expect } = require('@playwright/test')

const env = {
  guillotina: process.env.GUILLOTINA || 'http://127.0.0.1:8080',
  db: process.env.GUILLOTINA_DB || 'db',
  container: process.env.GUILLOTINA_CONTAINER || 'container_test',
}

const apiBase = `${env.guillotina}/${env.db}`
const containerPath = `/${env.db}/${env.container}`
const containerApi = `${apiBase}/${env.container}`

const LOGIN_TYPES = ['root', 'container_test']

const ACTION_SELECTORS = {
  delete: "[data-test='btnDeleteTest']",
  btnConfirmModal: "[data-test='btnConfirmModalTest']",
  btnCancelModal: "[data-test='btnCancelModalTest']",
  prefixInputCopyId: 'inputCopyIdTest',
  inputPathTree: "[data-test='inputPathTreeTest']",
  confirmModal: "[data-test='btnConfirmModalTest']",
}

const BREADCRUMB_SELECTORS = {
  prefixItem: 'breadcrumbItemTest',
}

const FORM_SELECTORS = {
  containerFolder: "[data-test='formAddFolderTest']",
  containerItem: "[data-test='formAddItemTest']",
  containerUser: "[data-test='formAddUserTest']",
  containerGMI: "[data-test='formAddGMITest']",
}

const FORM_BASE_SELECTORS = {
  prefixField: 'TestInput',
  btn: "[data-test='formBaseBtnTestSubmit']",
}

const EDITABLE_FORM_SELECTORS = {
  prefixEditableField: 'editableFieldTest',
  iconEdit: "[data-test='iconEditTest']",
  field: "[data-test='editableFieldEditTest']",
  btnSave: "[data-test='editableFieldBtnSaveTest']",
  btnCancel: "[data-test='editableFieldBtnCancelTest']",
  btnDelete: "[data-test='editableFieldBtnDeleteTest']",
}

const USER_FORM_SELECTORS = {
  username: "[data-test='usernameTestInput']",
  password: "[data-test='passwordTestInput']",
  email: "[data-test='emailTestInput']",
  name: "[data-test='nameTestInput']",
  btnUpate: "[data-test='formUserTestBtnSubmit']",
}

const LOGIN_SELECTORS = {
  form: "[data-test='formLoginTest']",
  username: "[data-test='inputUsernameLoginTest']",
  password: "[data-test='inputPasswordLoginTest']",
  schema: "[data-test='selectSchemaTest']",
  btnSubmit: "[data-test='btnLoginTest']",
}

const NOTIFICATION_SELECTOR = "[data-test='notificationTest']"

const ITEMS_PANELS_SELECTORS = {
  table: "[data-test='itemPanelTableTest']",
  checkboxRow: "[data-test='itemCheckboxRowTest']",
  btnChooseAction: "[data-test='btnChooseActionTest']",
  btnCopyAction: "[data-test='dropdownItemTest-copy']",
  btnDeleteAction: "[data-test='dropdownItemTest-delete']",
  btnMoveAction: "[data-test='dropdownItemTest-move']",
  prefixItem: 'itemTest',
  prefixFilterItem: 'filterInput',
  prefixSortableItem: 'sortableColumn',
}

const CONTEXT_TOOLBAR_SELECTORS = {
  btnAddType: "[data-test='itemAddTypeTest']",
  btnAddFolder: "[data-test='dropdownItemTest-folder']",
  btnAddItem: "[data-test='dropdownItemTest-item']",
  btnAddGMI: "[data-test='dropdownItemTest-gmi']",
  selectFilteType: "[data-test='selectFilterTypeTest']",
  inputFilter: "[data-test='inputFilterTest']",
  btnInputFilter: "[data-test='btnInputFilterTest']",
}

const TABS_PANEL_SELECTOS = {
  prefixTabs: 'tabTest',
}

const PERMISSIONS_SELECTORS = {
  selectPrincipal: "[data-test='selectPrincipalTest']",
  selectPermissions: "[data-test='selectPermissionsTest']",
  selectRole: "[data-test='selectRoleTest']",
  operationPermissions: "[data-test='operationPermissionsTest']",
  btnSubmitPermissions: "[data-test='btnSubmitPermissionsTest']",
  selectPermissionType: "[data-test='selectPermissionTypeTest']",
  containerPermissionsInfo: "[data-test='containerPermissionsInfoTest']",
}

function buildAppPath(pathname = '') {
  if (!pathname) return '/?path='
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `/?path=${normalized}`
}

async function guardResponse(response, allowedStatuses) {
  if (allowedStatuses.includes(response.status())) {
    return
  }
  const body = await response.text()
  throw new Error(`Unexpected status ${response.status()}: ${body}`)
}

async function setupGuillotina(request) {
  const headers = {
    Authorization: 'Basic cm9vdDpyb290',
    'Content-Type': 'application/json',
  }

  await guardResponse(
    await request.post(apiBase, {
      headers,
      data: { '@type': 'Container', id: env.container },
    }),
    [200, 201, 409]
  )

  await guardResponse(
    await request.post(`${containerApi}/@addons`, {
      headers,
      data: { id: 'dbusers' },
    }),
    [200, 201, 409]
  )

  await guardResponse(
    await request.post(`${containerApi}/@addons`, {
      headers,
      data: { id: 'image' },
    }),
    [200, 201, 409]
  )

  await guardResponse(
    await request.post(`${containerApi}/groups`, {
      headers,
      data: {
        '@type': 'Group',
        id: 'group_view_content',
        title: 'group_view_content',
      },
    }),
    [200, 201, 409]
  )

  await guardResponse(
    await request.post(`${containerApi}/users`, {
      headers,
      data: {
        '@type': 'User',
        username: 'default',
        password: 'default',
        email: 'default@test.com',
        user_groups: ['group_view_content'],
      },
    }),
    [200, 201, 409]
  )

  await guardResponse(
    await request.post(containerApi, {
      headers,
      data: {
        '@type': 'Folder',
        id: 'gmi_folder',
        title: 'GMI Folder',
      },
    }),
    [200, 201, 409]
  )

  for (let i = 0; i < 50; i++) {
    await guardResponse(
      await request.post(`${containerApi}/gmi_folder`, {
        headers,
        data: {
          '@type': 'GMI',
          title: `Test GMI item ${i}`,
          number_field: i,
          boolean_field: i % 2 === 0,
          choice_field_vocabulary: ['plone', 'guillotina'][i % 2],
          choice_field: [
            'date',
            'integer',
            'text',
            'float',
            'keyword',
            'boolean',
          ][i % 6],
        },
      }),
      [200, 201, 409]
    )
  }
}

async function tearDownGuillotina(request) {
  const headers = {
    Authorization: 'Basic cm9vdDpyb290',
    'Content-Type': 'application/json',
  }

  await guardResponse(
    await request.delete(`${containerApi}/users/default`, { headers }),
    [200, 204, 404]
  )
  await guardResponse(
    await request.delete(`${containerApi}/users`, { headers }),
    [200, 204, 404]
  )
  await guardResponse(
    await request.delete(`${containerApi}/groups`, { headers }),
    [200, 204, 404]
  )
  await guardResponse(
    await request.delete(containerApi, { headers }),
    [200, 204, 404]
  )
}

function registerGuillotinaHooks(test) {
  test.beforeEach(async ({ request }) => {
    await setupGuillotina(request)
  })
  test.afterEach(async ({ request }) => {
    await tearDownGuillotina(request)
  })
}

async function setLanguage(page, language) {
  await page.addInitScript(
    ({ language: lang }) => {
      Object.defineProperty(window.navigator, 'language', { value: lang })
    },
    { language }
  )
}

async function setAuthStorage(page, token, expiresAt) {
  await page.addInitScript(
    ({ token: authToken, expiresAt: authExpires }) => {
      window.localStorage.setItem('auth', authToken)
      window.localStorage.setItem('auth_expires', authExpires)
    },
    { token, expiresAt }
  )
}

async function autologin(
  page,
  request,
  { username = 'root', password = 'root', apiUrl, language = 'en' } = {}
) {
  const url = apiUrl || env.guillotina
  const headers = { 'Content-Type': 'application/json' }
  const response = await request.post(`${url}/@login`, {
    headers,
    data: { username, password },
  })
  const data = await response.json()
  await setLanguage(page, language)
  await setAuthStorage(page, data.token, new Date(data.exp).getTime())
  await page.goto(buildAppPath())
  await expect(page.locator('.box > .container')).toBeVisible()
}

async function rootLogin(page, { username = 'root', password = 'root' } = {}) {
  await page.goto(buildAppPath())
  await expect(page.locator(LOGIN_SELECTORS.form)).toBeVisible()
  await page.fill(LOGIN_SELECTORS.username, username)
  await page.fill(LOGIN_SELECTORS.password, password)
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/@login')
    ),
    page.click(LOGIN_SELECTORS.btnSubmit),
  ])
  await expect(page.locator(LOGIN_SELECTORS.form)).toHaveCount(0)
  await page.goto(buildAppPath(`${containerPath}/`))
}

async function containerLogin(
  page,
  { username = 'root', password = 'root', language = 'en' } = {}
) {
  await setLanguage(page, language)
  await page.goto(buildAppPath())
  await expect(page.locator(LOGIN_SELECTORS.form)).toBeVisible()
  await page.fill(LOGIN_SELECTORS.username, username)
  await page.fill(LOGIN_SELECTORS.password, password)
  await page.selectOption(LOGIN_SELECTORS.schema, `${containerPath}/`)
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/@login')
    ),
    page.click(LOGIN_SELECTORS.btnSubmit),
  ])
  await expect(page.locator(LOGIN_SELECTORS.form)).toHaveCount(0)
}

async function login(page, type, options) {
  if (type === 'root') {
    await rootLogin(page, options)
  } else {
    await containerLogin(page, options)
  }
}

// Fill login form without navigating (use when form is already visible)
async function fillLoginForm(
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
  await expect(page.locator(LOGIN_SELECTORS.form)).toHaveCount(0)
}

async function goToContainer(page, type) {
  if (type === 'root') {
    await page.click(
      `[data-test='${BREADCRUMB_SELECTORS.prefixItem}-${env.container}']`
    )
  } else {
    await page.click(`[data-test='${BREADCRUMB_SELECTORS.prefixItem}-home']`)
  }
}

async function addContent(page, name, id, selector) {
  await page.click(CONTEXT_TOOLBAR_SELECTORS.btnAddType)
  await page.click(CONTEXT_TOOLBAR_SELECTORS[selector])
  await page.fill(`[data-test='title${FORM_BASE_SELECTORS.prefixField}']`, name)
  await expect(
    page.locator(`[data-test='id${FORM_BASE_SELECTORS.prefixField}']`)
  ).toHaveValue(id)
  await page.click(FORM_BASE_SELECTORS.btn)
  await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
    'Content created!'
  )
}

async function addGMI(page, { name, id, number = '5', choice = 'keyword' }) {
  await page.click(CONTEXT_TOOLBAR_SELECTORS.btnAddType)
  await page.click(CONTEXT_TOOLBAR_SELECTORS.btnAddGMI)
  await expect(page.locator(FORM_SELECTORS.containerGMI)).toContainText(
    'Add GMI'
  )
  await page.fill(`[data-test='title${FORM_BASE_SELECTORS.prefixField}']`, name)
  await expect(
    page.locator(`[data-test='uuid${FORM_BASE_SELECTORS.prefixField}']`)
  ).toHaveValue(id)
  await page.fill(
    `[data-test='number_field${FORM_BASE_SELECTORS.prefixField}']`,
    number
  )
  await page.selectOption(
    `[data-test='choice_field${FORM_BASE_SELECTORS.prefixField}']`,
    choice
  )
  await page.click(FORM_BASE_SELECTORS.btn)
  await expect(page.locator(NOTIFICATION_SELECTOR)).toContainText(
    'Content created!'
  )
}

async function expectTableRowCount(page, tableSelector, total) {
  await expect(page.locator(tableSelector).locator('tbody tr')).toHaveCount(
    total
  )
}

function getFixturePath(filename) {
  return path.join(__dirname, 'fixtures', filename)
}

module.exports = {
  env,
  apiBase,
  containerPath,
  containerApi,
  LOGIN_TYPES,
  ACTION_SELECTORS,
  BREADCRUMB_SELECTORS,
  FORM_SELECTORS,
  FORM_BASE_SELECTORS,
  EDITABLE_FORM_SELECTORS,
  USER_FORM_SELECTORS,
  LOGIN_SELECTORS,
  NOTIFICATION_SELECTOR,
  ITEMS_PANELS_SELECTORS,
  CONTEXT_TOOLBAR_SELECTORS,
  TABS_PANEL_SELECTOS,
  PERMISSIONS_SELECTORS,
  buildAppPath,
  setupGuillotina,
  tearDownGuillotina,
  registerGuillotinaHooks,
  autologin,
  rootLogin,
  containerLogin,
  login,
  fillLoginForm,
  goToContainer,
  addContent,
  addGMI,
  expectTableRowCount,
  getFixturePath,
}
