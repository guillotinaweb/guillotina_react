import ErrorZone from '../error_zone'
import useSetState from '../../hooks/useSetState'
import { Button } from '../input/button'
import { Select } from '../input/select'
import { useCrudContext } from '../../hooks/useCrudContext'
import { useTraversal } from '../../contexts'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'

interface State {
  principal?: string
  roles: string[]
  setting?: string
  error?: string
}
interface Props {
  principals?: { text: string; value: string }[]
  roles: { text: string; value: string }[]
  operations: { text: string; value: string }[]
  refresh: (value: number) => void
}
export function PermissionPrinrole({
  principals,
  roles,
  operations,
  refresh,
}: Props) {
  const intl = useIntl()
  const Ctx = useTraversal()
  const { post, loading } = useCrudContext()
  const [state, setState] = useSetState<State>({
    principal: undefined,
    roles: [],
    setting: undefined,
    error: undefined,
  })

  const savePermission = async () => {
    if (!state.principal || !state.setting || state.roles.length === 0) {
      setState({ error: intl.formatMessage(genericMessages.invalid_form_data) })
      return
    }
    setState({ error: undefined })
    const data = {
      prinrole: state.roles.map((perm) => ({
        principal: state.principal,
        role: perm,
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
      {state.error && (
        <ErrorZone>
          {intl.formatMessage(genericMessages.invalid_form_data)}
        </ErrorZone>
      )}
      <div className="field">
        <label className="label">
          {intl.formatMessage(genericMessages.select_principal)}
        </label>
        <Select
          appendDefault
          options={principals ?? []}
          onChange={(value) => setState({ principal: value as string })}
          dataTest="selectPrincipalTest"
        />
      </div>
      <div className="field">
        <label className="label">
          {intl.formatMessage(genericMessages.select_role)}
        </label>
        <Select
          options={roles}
          onChange={(values) => {
            setState({ roles: values as string[] })
          }}
          size={5}
          multiple
          dataTest="selectRoleTest"
        />
      </div>
      <div className="field">
        <label className="label">
          {intl.formatMessage(genericMessages.operation)}
        </label>
        <Select
          appendDefault
          options={operations}
          onChange={(value) => setState({ setting: value as string })}
          dataTest="operationPermissionsTest"
        />
      </div>
      <Button
        className="is-primary is-small"
        loading={loading}
        onClick={savePermission}
        dataTest="btnSubmitPermissionsTest"
      >
        {intl.formatMessage(genericMessages.save)}
      </Button>
    </div>
  )
}
