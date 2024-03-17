import ErrorZone from '../error_zone'
import useSetState from '../../hooks/useSetState'
import { Button } from '../input/button'
import { Select } from '../input/select'
import { useCrudContext } from '../../hooks/useCrudContext'
import { useTraversal } from '../../contexts'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'

interface State {
  role: string
  permission: string[]
  setting: string
  error: string
}
interface Props {
  roles: { text: string; value: string }[]
  permissions?: { text: string; value: string }[]
  operations: { text: string; value: string }[]
  refresh: (value: number) => void
}
export function PermissionRoleperm({
  roles,
  permissions,
  operations,
  refresh,
}: Props) {
  const intl = useIntl()
  const Ctx = useTraversal()
  const { post, loading } = useCrudContext()
  const [state, setState] = useSetState<State>({
    role: undefined,
    permission: [],
    setting: undefined,
    error: undefined,
  })

  const savePermission = async () => {
    if (!state.role || !state.setting || state.permission.length === 0) {
      setState({ error: intl.formatMessage(genericMessages.invalid_form) })
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
      {state.error && (
        <ErrorZone>
          {intl.formatMessage(genericMessages.invalid_form_data)}
        </ErrorZone>
      )}
      <div className="field">
        <label className="label">
          {intl.formatMessage(genericMessages.select_role)}
        </label>
        <Select
          appendDefault
          options={roles}
          onChange={(value) => setState({ role: value as string })}
          dataTest="selectRoleTest"
        />
      </div>
      <div className="field">
        <label className="label">
          {intl.formatMessage(genericMessages.select_permissions)}
        </label>
        <Select
          options={permissions ?? []}
          onChange={(values) => {
            setState({ permission: values as string[] })
          }}
          dataTest="selectPermissionsTest"
          size={5}
          multiple
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
