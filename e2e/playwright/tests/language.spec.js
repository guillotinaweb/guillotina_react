const { test, expect } = require('@playwright/test')
const { registerGuillotinaHooks, containerLogin } = require('../utils')

registerGuillotinaHooks(test)

test.describe('check languages', () => {
  test('Check eng language', async ({ page }) => {
    await containerLogin(page)
    await page.getByText('Addons', { exact: true }).click()
    // Wait for addons tab content to load - use heading role for section titles
    await expect(
      page.getByRole('heading', { name: 'Available Addons' })
    ).toBeVisible()
    await expect(page.getByText('Install').first()).toBeVisible()
    await expect(page.getByText('Remove').first()).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Installed Addons' })
    ).toBeVisible()
    await page.getByText('Actions', { exact: true }).click()
    // Wait for actions tab content to load
    await expect(page.getByText('Delete')).toBeVisible()
    await expect(page.getByText('Move to...')).toBeVisible()
    await expect(page.getByText('Copy to...')).toBeVisible()
  })

  test('Check ca language', async ({ page }) => {
    await containerLogin(page, { language: 'ca' })
    await page.getByText('Addons', { exact: true }).click()
    // Wait for addons tab content to load - use heading role for section titles
    await expect(
      page.getByRole('heading', { name: 'Addons Disponibles' })
    ).toBeVisible()
    await expect(page.getByText('Instal·la').first()).toBeVisible()
    await expect(page.getByText('Elimina').first()).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Addons Instal·lats' })
    ).toBeVisible()

    await page.getByText('Actions', { exact: true }).click()
    // Wait for actions tab content to load
    await expect(page.getByText('Mou a...')).toBeVisible()
    await expect(page.getByText('Copia a...')).toBeVisible()
  })

  test('Check es language', async ({ page }) => {
    await containerLogin(page, { language: 'es' })
    await page.getByText('Addons', { exact: true }).click()
    // Wait for addons tab content to load - use heading role for section titles
    await expect(
      page.getByRole('heading', { name: 'Complementos Disponibles' })
    ).toBeVisible()
    await expect(page.getByText('Instalar').first()).toBeVisible()
    await expect(page.getByText('Eliminar').first()).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Complementos Instalados' })
    ).toBeVisible()

    await page.getByText('Actions', { exact: true }).click()
    // Wait for actions tab content to load
    await expect(page.getByText('Mover a...')).toBeVisible()
    await expect(page.getByText('Copiar a...')).toBeVisible()
  })
})
