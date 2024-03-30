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
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'
import { useEffect, useRef, useState } from 'react'
import { GuillotinaUser, SearchItem } from '../types/guillotina'
import { FilterFormElement, IndexSignature } from '../types/global'

const tabs = {
  Users: PanelItems,
}

export function UsersToolbar() {
  const intl = useIntl()
  const Ctx = useTraversal()
  const ref = useRef<HTMLInputElement>(null)
  const [location, setLocation] = useLocation()
  const searchText = location.get('q')

  const onSearchQuery = (event: React.FormEvent<FilterFormElement>) => {
    event.preventDefault()
    setLocation({ q: event.currentTarget.elements.filterInput.value, page: 0 })
  }

  // cleanup form on state.search change
  useEffect(() => {
    if (ref.current && (!searchText || searchText === '')) {
      ref.current.value = ''
    }
  }, [searchText])

  return (
    <>
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
                id="filterInput"
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
        <span>{intl.formatMessage(genericMessages.add_user)}</span>
      </button>
    </>
  )
}

export function UsersCtx() {
  return (
    <TabsPanel tabs={tabs} currentTab="Users" rightToolbar={<UsersToolbar />} />
  )
}

interface State {
  roles: string[]
  groups: {
    value: string
    text: string
  }[]
}
export function UserCtx() {
  const intl = useIntl()
  const { Ctx, patch, loading } = useCrudContext()

  const [state, setState] = useState<State>({ roles: [], groups: [] })

  const userDataContext = Ctx.context as GuillotinaUser
  const fields = {
    user_groups: [],
    user_roles: userDataContext.user_roles,
  }

  const [remotes, updateRemote] = useRemoteField(fields)

  useEffect(() => {
    async function getRolesAndGroups() {
      const [requestGetGroups, requestGetRoles] = await Promise.all([
        Ctx.client.search<SearchItem>(Ctx.path, { type_name: 'Group' }, true),
        Ctx.client.getRoles(Ctx.path),
      ])

      const groups = requestGetGroups
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
    }
    getRolesAndGroups()
  }, [])

  const updateObject = async (data: IndexSignature) => {
    Ctx.apply(data)
    const { isError, errorMessage } = await patch(data)
    if (isError) {
      Ctx.flash(
        intl.formatMessage(genericMessages.failed_to_update, {
          error: errorMessage,
        }),
        'danger'
      )
    } else {
      Ctx.flash(
        intl.formatMessage({
          id: 'user_updated',
          defaultMessage: 'User updated',
        }),
        'primary'
      )
      Ctx.refresh()
    }
  }

  return (
    <div className="container">
      <h2 className="title is-size-4">
        <Icon icon="fas fa-user"></Icon>
        &nbsp;
        {intl.formatMessage({
          id: 'user',
          defaultMessage: 'User',
        })}
      </h2>

      <hr />
      <div className="columns">
        <div className="column">
          <div className="container user-props">
            <p>
              <label>
                {intl.formatMessage({
                  id: 'username',
                  defaultMessage: 'Username',
                })}
                :{' '}
              </label>{' '}
              {userDataContext.username} ({userDataContext.email})
            </p>
            <p>
              <label>
                {' '}
                {intl.formatMessage({
                  id: 'creation_date',
                  defaultMessage: 'Creation Date',
                })}
                :{' '}
              </label>{' '}
              {formatDate(userDataContext.creation_date)}
            </p>
            <p>
              <label>
                {' '}
                {intl.formatMessage({
                  id: 'modification_date',
                  defaultMessage: 'Modification Date',
                })}
                :{' '}
              </label>{' '}
              {formatDate(userDataContext.modification_date)}
            </p>
            <Button
              className="is-size-7 is-info"
              onClick={() => {
                Ctx.doAction('changePassword')
              }}
            >
              {intl.formatMessage({
                id: 'change_password',
                defaultMessage: 'Change Password',
              })}
            </Button>
          </div>
          <hr />
          <UserForm
            actionName="Save"
            onSubmit={(ev) => updateObject(ev)}
            formData={userDataContext}
            exclude={['password']}
            remotes={remotes}
            submitButton={false}
          >
            <Button loading={loading} dataTest="formUserTestBtnSubmit">
              {intl.formatMessage(genericMessages.save)}
            </Button>
          </UserForm>
        </div>
        <div className="column">
          <TagsWidget
            onChange={updateRemote('user_groups')}
            items={userDataContext.user_groups}
            title="Groups"
            noData={intl.formatMessage({
              id: 'there_is_no_groups_for_this_user',
              defaultMessage: 'There is no groups for this user',
            })}
            available={state.groups}
          />
          <hr />
          <TagsWidget
            onChange={updateRemote('user_roles')}
            items={remotes.user_roles}
            title="Roles"
            noData={intl.formatMessage({
              id: 'the_user_doesnt_have_any_role',
              defaultMessage: "The user doesn't have any role",
            })}
            available={state.roles.map((x) => ({ value: x, text: x }))}
          />
        </div>
      </div>
    </div>
  )
}
