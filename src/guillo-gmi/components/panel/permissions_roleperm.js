import React from 'react'

import ErrorZone from '../error_zone'
import useSetState from '../../hooks/useSetState'
import { Button } from '../input/button'
import { Select } from '../input/select'
import { useCrudContext } from '../../hooks/useCrudContext'
import { useTraversal } from '../../contexts'

export function PermissionRoleperm({
  roles,
  permissions,
  operations,
  refresh,
}) {
  const Ctx = useTraversal()
  const { post, loading } = useCrudContext()
  const [state, setState] = useSetState({
    role: undefined,
    permission: [],
    setting: undefined,
    error: undefined,
  })

  const getMultiples = (field, setter) => (ev) => {
    let values = []
    for (let i = 0; i < ev.target.selectedOptions.length; i++) {
      values = values.concat([ev.target.selectedOptions[i].value])
    }
    setter({ [field]: values })
  }

  const savePermission = async () => {
    if (!state.role || !state.setting || state.permission.length === 0) {
      console.log(state)
      setState({ error: 'Invalid form' })
      return
    }
    setState({ error: undefined })
    const data = {
      roleperm: state.permission.map((perm) => ({
        role: state.role,
        permission: perm,
        setting: state.setting,
      })),
    }
    const { isError, errorMessage } = await post(data, '@sharing', false)
    if (!isError) {
      Ctx.flash('Permission updated!', 'success')
    } else {
      Ctx.flash(`An error has ocurred: ${errorMessage}`, 'danger')
    }

    refresh(Math.random())
  }

  return (
    <div className="container">
      {loading}
      {state.error && <ErrorZone>Invalid form data</ErrorZone>}
      <div className="field">
        <label className="label">Select a Role</label>
        <Select
          appendDefault
          options={roles}
          onChange={(ev) => setState({ role: ev.target.value })}
          dataTest="selectRoleTest"
        />
      </div>
      <div className="field">
        <label className="label">Select permissions</label>
        <Select
          options={permissions}
          onChange={getMultiples('permission', setState)}
          dataTest="selectPermissionsTest"
          size={5}
          multiple
        />
      </div>
      <div className="field">
        <label className="label">Operation</label>
        <Select
          appendDefault
          options={operations}
          onChange={(ev) => setState({ setting: ev.target.value })}
          dataTest="operationPermissionsTest"
        />
      </div>
      <Button
        className="is-primary is-small"
        loading={loading}
        onClick={savePermission}
        dataTest="btnSubmitPermissions"
      >
        Save
      </Button>
    </div>
  )
}
