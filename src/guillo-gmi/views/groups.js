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

const tabs = {
  Groups: PanelItems,
}

export function GroupToolbar() {
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
        onClick={() => Ctx.doAction('addItem', { type: 'Group' })}
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        <Icon icon="fas fa-users" />
        <span>Add a Group</span>
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
      Ctx.flash(`Failed to update!: ${errorMessage}`, 'danger')
    }
  }

  const addRole = async (ev) => {
    const role = ev.target.value
    const { isError, errorMessage } = await patch({
      user_roles: Ctx.context.user_roles.concat(role),
    })
    handleResponse(isError, `Role ${role} added to group`, errorMessage)
  }

  const removeRole = async (role) => {
    const { isError, errorMessage } = await patch({
      user_roles: Ctx.context.user_roles.filter((r) => r !== role),
    })
    handleResponse(isError, `Role ${role} removed from group`, errorMessage)
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
    handleResponse(isError, `User ${newUser.id} added to group!`, errorMessage)
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
      `User ${userToRemove} removed from group`,
      errorMessage
    )
  }

  return (
    <div className="container group-view">
      <h2 className="title is-size-4">
        <Icon icon="fas fa-users"></Icon>
        <span>&nbsp;Group</span>
      </h2>
      <hr />
      <div className="columns">
        <div className="column is-4">
          <label className="label">Title: </label>
          <EditableField
            field="title"
            modifyContent
            value={Ctx.context.title}
          />
        </div>
        <div className="column is-4 is-size-7">
          <h3 className="title is-size-6">Roles</h3>
          <p>Add a Role</p>
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
          <h3 className="title is-size-6">Users</h3>
          <p>Add a User</p>
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
