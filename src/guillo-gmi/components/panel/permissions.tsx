import useSetState from '../../hooks/useSetState'
import { PermissionPrinperm } from './permissions_prinperm'
import { PermissionPrinrole } from './permissions_prinrole'
import { PermissionRoleperm } from './permissions_roleperm'
import { Select } from '../input/select'
import { Sharing } from '../../models'
import { Table } from '../ui/table'
import { useCrudContext } from '../../hooks/useCrudContext'
import { useTraversal } from '../../contexts'
import { defineMessages, useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { GuillotinaSharing } from '../../types/guillotina'

const messages = defineMessages({
  role_permissions: {
    id: 'role_permissions',
    defaultMessage: 'Role Permissions',
  },
  no_role_permissions: {
    id: 'no_role_permissions',
    defaultMessage: 'No roles permissions defined',
  },
  no_principal_permissions: {
    id: 'no_principal_permissions',
    defaultMessage: 'No principal permissions defined',
  },
  no_principal_roles: {
    id: 'no_principal_roles',
    defaultMessage: 'No principal roles defined',
  },
  principal_permissions: {
    id: 'principal_permissions',
    defaultMessage: 'Principal Permissions',
  },
  principal_roles: {
    id: 'principal_roles',
    defaultMessage: 'Principal Roles',
  },
  allow: {
    id: 'allow',
    defaultMessage: 'Allow',
  },
  deny: {
    id: 'deny',
    defaultMessage: 'Deny',
  },
  allow_single: {
    id: 'allow_single',
    defaultMessage: 'AllowSingle',
  },
  unset: {
    id: 'unset',
    defaultMessage: 'Unset',
  },
  add_permissions: {
    id: 'add_permissions',
    defaultMessage: 'Add Permissions',
  },
  select_type: {
    id: 'select_type',
    defaultMessage: 'Select a type:',
  },
})

export function PanelPermissions() {
  const intl = useIntl()
  const { get, result, loading } = useCrudContext<GuillotinaSharing>()
  const ctx = useTraversal()

  const [reset, setReset] = useState(1)

  useEffect(() => {
    get('@sharing')
  }, [reset])

  const perms = useMemo(() => {
    if (result) {
      return new Sharing(result)
    }
    return null
  }, [result])
  if (perms === null) {
    return null
  }
  return (
    <div className="columns">
      {!loading && (
        <div
          className="column is-8 is-size-7 permissions"
          data-test="containerPermissionsInfoTest"
        >
          <h2 className="title is-size-5 has-text-grey-dark">
            {intl.formatMessage(messages.role_permissions)}
          </h2>
          <Table
            headers={[
              intl.formatMessage(genericMessages.role),
              intl.formatMessage(genericMessages.permission),
              intl.formatMessage(genericMessages.setting),
            ]}
          >
            {perms.roles.map((role, idx) => (
              <Fragment key={'ff' + idx}>
                <tr>
                  <td colSpan={3} className="has-text-link">
                    {role}
                  </td>
                  {/* <td>
                    <Icon icon="fas fa-ban" />
                    <span>Remove</span>
                  </td> */}
                </tr>
                {Object.keys(perms.getRole(role)).map((row, idx) => (
                  <tr key={'k' + idx}>
                    <td></td>
                    <td>{row}</td>
                    <td>{perms.getRole(role)[row]}</td>
                  </tr>
                ))}
              </Fragment>
            ))}
            {perms.roles.length === 0 && (
              <tr>
                <td colSpan={3}>
                  {intl.formatMessage(messages.no_role_permissions)}
                </td>
              </tr>
            )}
          </Table>
          <h2 className="title is-size-5 has-text-grey-dark">
            {intl.formatMessage(messages.principal_permissions)}
          </h2>
          <Table
            headers={[
              intl.formatMessage(genericMessages.role),
              intl.formatMessage(genericMessages.permission),
              intl.formatMessage(genericMessages.setting),
            ]}
          >
            {perms.principals.map((role, idx) => (
              <Fragment key={'f2' + idx}>
                <tr>
                  <td colSpan={3} className="has-text-link">
                    {role}
                  </td>
                </tr>
                {Object.keys(perms.getPrincipals(role)).map((row, idx) => (
                  <tr key={'x' + idx}>
                    <td></td>
                    <td>{row}</td>
                    <td>{perms.getPrincipals(role)[row]}</td>
                  </tr>
                ))}
              </Fragment>
            ))}
            {perms.principals.length === 0 && (
              <tr>
                <td colSpan={3}>
                  {intl.formatMessage(messages.no_principal_permissions)}
                </td>
              </tr>
            )}
          </Table>
          <h2 className="title is-size-5 has-text-grey-dark">
            {intl.formatMessage(messages.principal_roles)}
          </h2>
          <Table
            headers={[
              intl.formatMessage(genericMessages.role),
              intl.formatMessage(genericMessages.permission),
              intl.formatMessage(genericMessages.setting),
            ]}
          >
            {perms.prinrole.map((role, idx) => (
              <Fragment key={role + idx}>
                <tr>
                  <td colSpan={3} className="has-text-link">
                    {role}
                  </td>
                </tr>
                {Object.keys(perms.getPrinroles(role)).map((row, idx) => (
                  <tr key={'xx' + idx}>
                    <td></td>
                    <td>{row}</td>
                    <td>{perms.getPrinroles(role)[row]}</td>
                  </tr>
                ))}
              </Fragment>
            ))}
            {perms.prinrole.length === 0 && (
              <tr>
                <td colSpan={3}>
                  {intl.formatMessage(messages.no_role_permissions)}
                </td>
              </tr>
            )}
          </Table>
        </div>
      )}
      {ctx.hasPerm('guillotina.ChangePermissions') && (
        <AddPermission refresh={setReset} reset={reset} />
      )}
    </div>
  )
}

interface State {
  permissions?: { text: string; value: string }[]
  roles: { text: string; value: string }[]
  principals?: { text: string; value: string }[]
  current: string
}
const initial: State = {
  permissions: undefined,
  roles: [],
  principals: undefined,
  current: '',
}

interface AddPermissionProps {
  refresh: (state: number) => void
  reset: number
}
export function AddPermission({ refresh, reset }: AddPermissionProps) {
  const Ctx = useTraversal()
  const [state, setState] = useSetState<State>(initial)
  const intl = useIntl()

  const operations = [
    { text: intl.formatMessage(messages.allow), value: 'Allow' },
    { text: intl.formatMessage(messages.deny), value: 'Deny' },
    { text: intl.formatMessage(messages.allow_single), value: 'AllowSingle' },
    { text: intl.formatMessage(messages.unset), value: 'Unset' },
  ]

  const defaultOptions = [
    { text: intl.formatMessage(genericMessages.choose), value: '' },
    { text: intl.formatMessage(messages.role_permissions), value: 'roleperm' },
    {
      text: intl.formatMessage(messages.principal_permissions),
      value: 'prinperm',
    },
    { text: intl.formatMessage(messages.principal_roles), value: 'prinrole' },
  ]

  useEffect(() => {
    async function init() {
      const permissions = (await Ctx.client.getAllPermissions(Ctx.path)).map(
        (perm) => ({
          text: perm,
          value: perm,
        })
      )
      let principals = []
      let roles = []

      const principalsData = await Ctx.client.getPrincipals(Ctx.path)
      const groups = principalsData.groups.map((group) => ({
        text: group['@name'],
        value: group['@name'],
      }))
      const users = principalsData.users.map((user) => ({
        text: user.fullname || user['@name'],
        value: user['@name'],
      }))
      principals = [...groups, ...users]

      const req = await Ctx.client.getRoles(Ctx.path)
      if (req.ok) {
        roles = (await req.json()).map((role: string) => ({
          text: role,
          value: role,
        }))
      }
      setState({ permissions, roles, principals })
    }

    init()
  }, [reset])

  return (
    <div className="column is-4 is-size-7">
      <h1 className="title is-size-5">
        {intl.formatMessage(messages.add_permissions)}
      </h1>
      <p>{intl.formatMessage(messages.select_type)}</p>
      <Select
        options={defaultOptions}
        onChange={(value) => setState({ current: value as string })}
        dataTest="selectPermissionTypeTest"
      />
      <hr />
      {state.current && state.current === 'roleperm' && (
        <PermissionRoleperm
          {...state}
          operations={operations}
          refresh={refresh}
        />
      )}
      {state.current && state.current === 'prinperm' && (
        <PermissionPrinperm
          {...state}
          operations={operations}
          refresh={refresh}
        />
      )}
      {state.current && state.current === 'prinrole' && (
        <PermissionPrinrole
          {...state}
          operations={operations}
          refresh={refresh}
        />
      )}
    </div>
  )
}
