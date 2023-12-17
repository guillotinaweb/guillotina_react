import React from 'react'

import ErrorZone from '../error_zone'
import useSetState from '../../hooks/useSetState'
import { Button } from '../input/button'
import { Select } from '../input/select'
import { useCrudContext } from '../../hooks/useCrudContext'
import { useTraversal } from '../../contexts'

export function PermissionPrinperm({
  principals,
  permissions,
  operations,
  refresh,
}) {
  const Ctx = useTraversal()
  const { post, loading } = useCrudContext()
  const [state, setState] = useSetState({
    principal: undefined,
    permission: [],
    setting: undefined,
    error: undefined,
  })

  const getMultiples = (field, setter) => (values) => {
    setter({ [field]: values })
  }

  const savePermission = async () => {
    if (!state.principal || !state.setting || state.permission.length === 0) {
      setState({ error: 'Invalid form' })
      return
    }
    setState({ error: undefined })
    const data = {
      prinperm: state.permission.map((perm) => ({
        principal: state.principal,
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
        <label className="label">Select a Principal</label>
        <Select
          appendDefault
          options={principals}
          onChange={(value) => setState({ principal: value })}
          dataTest="selectPrincipalTest"
        />
      </div>
      <div className="field">
        <label className="label">Select permissions</label>
        <Select
          options={permissions}
          onChange={getMultiples('permission', setState)}
          size={5}
          multiple
          dataTest="selectPermissionsTest"
        />
      </div>
      <div className="field">
        <label className="label">Operation</label>
        <Select
          appendDefault
          options={operations}
          onChange={(value) => setState({ setting: value })}
          dataTest="operationPermissionsTest"
        />
      </div>
      <Button
        className="is-primary is-small"
        loading={loading}
        onClick={savePermission}
        dataTest="btnSubmitPermissionsTest"
      >
        Save
      </Button>
    </div>
  )
}
