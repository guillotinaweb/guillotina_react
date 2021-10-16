import { TABS_PANEL_SELECTOS } from '../elements/panels-selectors'
import { PERMISSIONS_SELECTORS } from '../elements/permissions-selectors'
import { NOTIFICATION_SELECTOR } from '../elements/notification-selectors'

describe('Permissions tests', () => {
  beforeEach('clear', function () {
    cy.clearLocalStorage()
    cy.clearCookies()

    cy.interceptPostObject('@sharing')
    cy.interceptGetObject('@sharing')
    cy.interceptGetObject('@groups')
    cy.interceptGetObject('@users')
    cy.interceptGetObject('@available-roles')

    cy.autologin({
      username: 'default',
      password: 'default',
      api_url: `${Cypress.env('GUILLOTINA')}/${Cypress.env(
        'GUILLOTINA_DB'
      )}/${Cypress.env('GUILLOTINA_CONTAINER')}/`,
    })

    cy.visit(
      `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/`
    )
    cy.contains('Not Allowed')

    // Logout and login as root
    cy.clearLocalStorage()
    cy.clearCookies()

    cy.autologin()
    cy.visit(
      `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/`
    )
    cy.get(
      `[data-test='${TABS_PANEL_SELECTOS.prefixTabs}-permissions']`
    ).click()

    cy.wait('@get-object-@sharing')
    cy.wait('@get-object-@groups')
    cy.wait('@get-object-@users')
    cy.wait('@get-object-@available-roles')
  })
  it('Principal - permission tab, set permissions to user', () => {
    cy.get(PERMISSIONS_SELECTORS.selectPermissionType).select(
      'Principal Permissions'
    )
    cy.get(PERMISSIONS_SELECTORS.selectPrincipal).select('default')
    cy.get(PERMISSIONS_SELECTORS.selectPermissions).select([
      'guillotina.ViewContent',
      'guillotina.AccessContent',
      'guillotina.SearchContent',
    ])

    cy.get(PERMISSIONS_SELECTORS.operationPermissions).select('Allow')
    cy.get(PERMISSIONS_SELECTORS.btnSubmitPermissions).click()
    cy.wait('@post-object-@sharing')
    cy.get(NOTIFICATION_SELECTOR).should('contain', 'Permission updated!')

    cy.get(PERMISSIONS_SELECTORS.containerPermissionsInfo).within(() => {
      cy.contains('guillotina.ViewContent')
      cy.contains('guillotina.AccessContent')
      cy.contains('guillotina.SearchContent')
      cy.contains('default')
    })

    // Logout and login as default user
    cy.clearLocalStorage()
    cy.clearCookies()

    cy.autologin({
      username: 'default',
      password: 'default',
      api_url: `${Cypress.env('GUILLOTINA')}/${Cypress.env(
        'GUILLOTINA_DB'
      )}/${Cypress.env('GUILLOTINA_CONTAINER')}/`,
    })

    cy.visit(
      `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/`
    )
    cy.contains('Anything here!')
  })
  it('Principal - role tab, set roles to group', () => {
    cy.get(PERMISSIONS_SELECTORS.selectPermissionType).select('Principal Roles')
    cy.get(PERMISSIONS_SELECTORS.selectPrincipal).select('group_view_content')
    cy.get(PERMISSIONS_SELECTORS.selectRole).select([
      'guillotina.Reader',
      'guillotina.Member',
    ])
    cy.get(PERMISSIONS_SELECTORS.operationPermissions).select('Allow')
    cy.get(PERMISSIONS_SELECTORS.btnSubmitPermissions).click()
    cy.wait('@post-object-@sharing')
    cy.get(NOTIFICATION_SELECTOR).should('contain', 'Permission updated!')
    cy.get(PERMISSIONS_SELECTORS.containerPermissionsInfo).within(() => {
      cy.contains('guillotina.Reader')
      cy.contains('guillotina.Member')
      cy.contains('group_view_content')
    })

    // Logout and login as default user
    cy.clearLocalStorage()
    cy.clearCookies()

    cy.autologin({
      username: 'default',
      password: 'default',
      api_url: `${Cypress.env('GUILLOTINA')}/${Cypress.env(
        'GUILLOTINA_DB'
      )}/${Cypress.env('GUILLOTINA_CONTAINER')}/`,
    })

    cy.visit(
      `/${Cypress.env('GUILLOTINA_DB')}/${Cypress.env('GUILLOTINA_CONTAINER')}/`
    )
    cy.contains('Groups')
  })
  it('Role - permission tab ', () => {
    cy.get(PERMISSIONS_SELECTORS.selectPermissionType).select(
      'Role Permissions'
    )
    cy.get(PERMISSIONS_SELECTORS.selectRole).select(['guillotina.Reader'])
    cy.get(PERMISSIONS_SELECTORS.selectPermissions).select([
      'guillotina.SearchContent',
    ])
    cy.get(PERMISSIONS_SELECTORS.operationPermissions).select('Allow')
    cy.get(PERMISSIONS_SELECTORS.btnSubmitPermissions).click()
    cy.wait('@post-object-@sharing')
    cy.get(NOTIFICATION_SELECTOR).should('contain', 'Permission updated!')
    cy.get(PERMISSIONS_SELECTORS.containerPermissionsInfo).within(() => {
      cy.contains('guillotina.Reader')
      cy.contains('guillotina.SearchContent')
    })
  })
})
