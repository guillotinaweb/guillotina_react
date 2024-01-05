import React from 'react'
import { TabsPanel } from '../components/tabs'
import { PanelItems } from '../components/panel/items'
import { useTraversal } from '../contexts'
import { useCrudContext } from '../hooks/useCrudContext'
import { Icon } from '../components/ui/icon'
import { useEffect } from 'react'
import { useState } from 'react'
import { Select } from '../components/input/select'
import { SearchInput } from '../components/input/search_input'
import { Tag } from '../components/ui/tag'
import { parser } from '../lib/search'
import { EditableField } from '../components/fields/editableField'
import { useLocation } from '../hooks/useLocation'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

const tabs = {
  Groups: PanelItems,
}

export function GroupToolbar() {
  const intl = useIntl()
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
                placeholder={intl.formatMessage(genericMessages.search)}
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
        onClick={() => Ctx.doAction('addItem', { type: 'Group' })}
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        <Icon icon="fas fa-users" />
        <span>
          {intl.formatMessage({
            id: 'add_group',
            defaultMessage: 'Add Group',
          })}
        </span>
      </button>
    </React.Fragment>
  )
}

export function GroupsCtx(props) {
  return (
    <TabsPanel
      tabs={tabs}
      currentTab="Groups"
      rightToolbar={<GroupToolbar />}
      {...props}
    />
  )
}

let sortParsed = parser(`_sort_asc=id`)
let searchParsed = parser('type_name=User')

export function GroupCtx() {
  const intl = useIntl()
  const { Ctx, patch } = useCrudContext()
  const [roles, setRoles] = useState([])

  useEffect(() => {
    ;(async () => {
      const requestGetRoles = await Ctx.client.getRoles(Ctx.path)
      let roles = []

      if (requestGetRoles.ok) {
        roles = (await requestGetRoles.json()).map((role) => ({
          text: role,
          value: role,
        }))
      }
      setRoles(roles)
    })()
  }, [])

  const handleResponse = async (isError, message, errorMessage) => {
    if (!isError) {
      Ctx.flash(message, 'success')
      Ctx.refresh()
    } else {
      Ctx.flash(
        intl.formatMessage(genericMessages.failed_to_update, {
          error: errorMessage,
        }),
        'danger'
      )
    }
  }

  const addRole = async (role) => {
    const { isError, errorMessage } = await patch({
      user_roles: Ctx.context.user_roles.concat(role),
    })
    handleResponse(
      isError,
      intl.formatMessage(
        {
          id: 'role_added_to_group',
          defaultMessage: 'Role {role} added to group',
        },
        { role }
      ),
      errorMessage
    )
  }

  const removeRole = async (role) => {
    const { isError, errorMessage } = await patch({
      user_roles: Ctx.context.user_roles.filter((r) => r !== role),
    })
    handleResponse(
      isError,
      intl.formatMessage(
        {
          id: 'role_removed_from_group',
          defaultMessage: 'Role {role} removed from group',
        },
        { role }
      ),
      errorMessage
    )
  }

  const addUser = async (newUser) => {
    const data = {}
    Ctx.context.users.forEach((user) => {
      data[user] = true
    })
    data[newUser.id] = true
    const {
      isError,
      errorMessage,
    } = await Ctx.client.rest.patch(
      `${Ctx.containerPath}@groups/${Ctx.context['@name']}`,
      { users: data }
    )
    handleResponse(
      isError,
      intl.formatMessage(
        {
          id: 'user_added_to_group',
          defaultMessage: 'User {user} added to group',
        },
        { user: newUser.id }
      ),
      errorMessage
    )
  }

  const removeUser = async (userToRemove) => {
    const data = {}
    Ctx.context.users.forEach((user) => {
      data[user] = userToRemove !== user
    })
    const {
      isError,
      errorMessage,
    } = await Ctx.client.rest.patch(
      `${Ctx.containerPath}@groups/${Ctx.context['@name']}`,
      { users: data }
    )
    handleResponse(
      isError,
      intl.formatMessage(
        {
          id: 'user_removed_from_group',
          defaultMessage: 'User {user} removed from group',
        },
        { user: userToRemove }
      ),
      errorMessage
    )
  }

  return (
    <div className="container group-view">
      <h2 className="title is-size-4">
        <Icon icon="fas fa-users"></Icon>
        <span>
          &nbsp;
          {intl.formatMessage({
            id: 'group',
            defaultMessage: 'Group',
          })}
        </span>
      </h2>
      <hr />
      <div className="columns">
        <div className="column is-4">
          <label className="label">
            {intl.formatMessage(genericMessages.title)}{' '}
          </label>
          <EditableField
            field="title"
            modifyContent
            value={Ctx.context.title}
          />
        </div>
        <div className="column is-4 is-size-7">
          <h3 className="title is-size-6">
            {intl.formatMessage({
              id: 'roles',
              defaultMessage: 'Roles',
            })}
          </h3>
          <p>
            {intl.formatMessage({
              id: 'add_role',
              defaultMessage: 'Add a Role',
            })}
          </p>
          <Select
            options={roles.filter(
              (role) => !Ctx.context.user_roles.includes(role.value)
            )}
            appendDefault
            onChange={addRole}
          />
          <hr />
          {Ctx.context.user_roles.map((urole) => (
            <p className="control" key={`roles_${urole}`}>
              <Tag
                name={urole}
                onRemove={() => removeRole(urole)}
                size="is-small"
              />
            </p>
          ))}
        </div>
        <div className="column is-4 is-size-7">
          <h3 className="title is-size-6">
            {intl.formatMessage({
              id: 'users',
              defaultMessage: 'Users',
            })}
          </h3>
          <p>{intl.formatMessage(genericMessages.add_user)}</p>
          <SearchInput
            path={`${Ctx.containerPath}/users/`}
            qs={[...searchParsed, ...sortParsed]}
            traversal={Ctx}
            onChange={addUser}
            btnClass="is-small"
          />
          <hr />
          {Ctx.context.users.map((user) => (
            <p className="control" key={`user_${user}`}>
              <Tag
                name={user}
                onRemove={() => removeUser(user)}
                size="is-small"
              />
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
