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
import { useLocation } from '../hooks/useLocation'

const tabs = {
  Users: PanelItems,
}

export function UsersToolbar() {
  const Ctx = useTraversal()
  const ref = React.useRef(null)
  const [location, setLocation] = useLocation()
  const searchText = location.get('q')

  const onSearchQuery = (ev) => {
    const search = ev.target[0].value
    setLocation({ q: search, page: 0 })
    ev.preventDefault()
  }

  // cleanup form on state.search change
  React.useEffect(() => {
    if (!searchText || searchText === '') {
      ref.current.value = ''
    }
  }, [searchText])

  return (
    <React.Fragment>
      <div className="level-item">
        <form action="" className="form" onSubmit={onSearchQuery}>
          <div className="field has-addons">
            <div className="control">
              <input
                ref={ref}
                type="text"
                className="input is-size-7"
                placeholder="Search..."
                data-test="inputFilterTest"
              />
            </div>
            <div className="control">
              <button
                className="button has-background-grey-lighter is-size-7"
                type="submit"
                data-test="btnInputFilter"
              >
                <Icon icon="fas fa-search" />
              </button>
            </div>
          </div>
        </form>
      </div>
      <button
        className="button is-primary"
        onClick={() => Ctx.doAction('addItem', { type: 'User' })}
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        <Icon icon="fas fa-user" />
        <span>Add a User</span>
      </button>
    </React.Fragment>
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
            <Button
              className="is-size-7 is-info"
              onClick={() => {
                Ctx.doAction('changePassword')
              }}
            >
              Change Password
            </Button>
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
            <Button loading={loading} dataTest="formUserTestBtnSubmit">
              Update
            </Button>
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
