import React from 'react'
import { TabsPanel } from '../components/tabs'
import { PanelItems } from '../components/panel/items'
import { useTraversal } from '../contexts'
import { useCrudContext } from '../hooks/useCrudContext'
import { Icon } from '../components/ui/icon'
import { useEffect } from 'react'
import { useState } from 'react'
import { Select } from '../components/input/select'
import { Tag } from '../components/ui/tag'
import { EditableField } from '../components/fields/editableField'

const tabs = {
  Groups: PanelItems,
}

export function GroupToolbar(props) {
  const Ctx = useTraversal()

  return (
    <button
      className="button is-primary"
      onClick={() => Ctx.doAction('addItem', { type: 'Group' })}
      aria-haspopup="true"
      aria-controls="dropdown-menu"
    >
      <Icon icon="fas fa-users" />
      <span>Add a Group</span>
    </button>
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

export function GroupCtx() {
  const { Ctx, patch } = useCrudContext()
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    ;(async () => {
      const getUsers = Ctx.client.getUsers(Ctx.path)
      const getRoles = Ctx.client.getRoles(Ctx.path)
      const [requestGetUsers, requestGetRoles] = await Promise.all([
        getUsers,
        getRoles,
      ])
      let users = []
      let roles = []

      if (requestGetUsers.ok) {
        users = (await requestGetUsers.json()).map((user) => ({
          text: user['@name'],
          value: user.id,
        }))
      }
      if (requestGetRoles.ok) {
        roles = (await requestGetRoles.json()).map((role) => ({
          text: role,
          value: role,
        }))
      }
      setUsers(users)
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

  const addUser = async (ev) => {
    const user = ev.target.value
    const data = {}
    Ctx.context.users.forEach((user) => {
      data[user] = false
    })
    const { isError, errorMessage } = await patch({ users: data })
    handleResponse(isError, `User ${user} added to group!`, errorMessage)
  }

  const removeUser = async (userToRemove) => {
    const data = {}
    Ctx.context.users.forEach((user) => {
      data[user] = userToRemove !== user
    })
    const { isError, errorMessage } = await patch({ users: data })
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
          <EditableField field="title" value={Ctx.context.title} />
        </div>
        <div className="column is-4 is-size-7">
          <h3 className="title is-size-6">Roles</h3>
          <p>Add a Role</p>
          <Select
            options={roles.filter(
              (role) => !Ctx.context.user_roles.includes(role.value)
            )}
            appendDefault
            resetOnChange
            onChange={addRole}
          />
          <hr />
          {Ctx.context.user_roles.map((urole) => (
            <p className="control">
              <Tag
                name={urole}
                onRemove={(ev) => removeRole(urole)}
                size="is-small"
              />
            </p>
          ))}
        </div>
        <div className="column is-4 is-size-7">
          <h3 className="title is-size-6">Users</h3>
          <p>Add a User</p>
          <Select
            options={users.filter(
              (user) => !Ctx.context.users.includes(user.value)
            )}
            appendDefault
            onChange={addUser}
          />
          <hr />
          {Ctx.context.users.map((user) => (
            <p className="control">
              <Tag
                name={user}
                onRemove={(ev) => removeUser(user)}
                size="is-small"
              />
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
