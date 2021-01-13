import React from 'react'

import ErrorZone from '../error_zone'
import useSetState from '../../hooks/useSetState'
import { Button } from '../input/button'
import { Select } from '../input/select'
import { useCrudContext } from '../../hooks/useCrudContext'

export function PermissionRoleperm({
  roles,
  permissions,
  operations,
  refresh,
}) {
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
    const data = {
      roleperm: state.permission.map((perm) => ({
        role: state.role,
        permission: perm,
        setting: state.setting,
      })),
    }
    await post(data, '@sharing', false)
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
        />
      </div>
      <div className="field">
        <label className="label">Select permissions</label>
        <Select
          options={permissions}
          onChange={getMultiples('permission', setState)}
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
        />
      </div>
      <Button
        className="is-primary is-small"
        loading={loading}
        onClick={savePermission}
      >
        Save
      </Button>
    </div>
  )
}
