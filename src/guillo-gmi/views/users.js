import React from 'react'
import { TabsPanel } from '../components/tabs'
import { PanelItems } from '../components/panel/items'
import { useTraversal } from '../contexts'
import { UserForm } from '../forms/users'
import { formatDate } from '../lib/utils'
import { useCrudContext } from '../hooks/useCrudContext'
import { TagsWidget } from '../components/widgets/tags'
import { Icon } from '../components/ui/icon'
import { Button } from '../components/input/button'
import { useRemoteField } from '../hooks/useRemoteField'

const tabs = {
  Users: PanelItems,
}

export function UsersToolbar(props) {
  const Ctx = useTraversal()

  return (
    <button
      className="button is-primary"
      onClick={() => Ctx.doAction('addItem', { type: 'User' })}
      aria-haspopup="true"
      aria-controls="dropdown-menu"
    >
      <Icon icon="fas fa-user" />
      <span>Add a User</span>
    </button>
  )
}

export function UsersCtx(props) {
  return (
    <TabsPanel
      tabs={tabs}
      currentTab="Users"
      rightToolbar={<UsersToolbar />}
      {...props}
    />
  )
}

export function UserCtx() {
  const { Ctx, patch, loading } = useCrudContext()

  const [state, setState] = React.useState({ roles: [], gorups: [] })

  const fields = {
    user_groups: [],
    user_roles: Ctx.context.user_roles,
  }

  const [remotes, updateRemote] = useRemoteField(fields)

  React.useEffect(() => {
    ;(async () => {
      const [requestGetGroups, requestGetRoles] = await Promise.all([
        Ctx.client.search(Ctx.path, { type_name: 'Group' }, true),
        Ctx.client.getRoles(Ctx.path),
      ])

      let groups = requestGetGroups
      let roles = []

      if (requestGetRoles.ok) {
        roles = await requestGetRoles.json()
      }

      setState({
        roles: roles,
        groups: groups.items.map((item) => ({
          value: item.id,
          text: item['@name'],
        })),
      })
    })()
  }, [])

  const updateObject = async (data) => {
    Ctx.apply(data)
    const { isError, errorMessage } = await patch(data)
    if (isError) {
      Ctx.flash(`Update failed: ${errorMessage}`, 'danger')
    } else {
      Ctx.flash('Data updated', 'primary')
      Ctx.refresh()
    }
  }

  return (
    <div className="container">
      <h2 className="title is-size-4">
        <Icon icon="fas fa-user"></Icon>
        &nbsp;User
      </h2>

      <hr />
      <div className="columns">
        <div className="column">
          <div className="container user-props">
            <p>
              <label>Username: </label> {Ctx.context.username} (
              {Ctx.context.email})
            </p>
            <p>
              <label> Created: </label> {formatDate(Ctx.context.creation_date)}
            </p>
            <p>
              <label> Updated: </label>{' '}
              {formatDate(Ctx.context.modification_date)}
            </p>
          </div>
          <hr />
          <UserForm
            actionName="Save"
            onSubmit={(ev) => updateObject(ev)}
            isEdit={true}
            formData={Ctx.context}
            exclude={['password']}
            remotes={remotes}
            submitButton={false}
          >
            <Button loading={loading} dataTest="formUserTestBtnSubmit">Update</Button>
          </UserForm>
        </div>
        <div className="column">
          <TagsWidget
            onChange={updateRemote('user_groups')}
            items={Ctx.context.user_groups}
            title="Groups"
            noData="There is no groups for this user"
            available={state.groups}
          />
          <hr />
          <TagsWidget
            onChange={updateRemote('user_roles')}
            items={remotes.user_roles}
            title="Roles"
            noData="The user doesn't have any role"
            available={state.roles}
          />
        </div>
      </div>
    </div>
  )
}
