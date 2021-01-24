import React from 'react'
import { useEffect } from 'react'

import Dropdown from './input/dropdown'
import useSetState from '../hooks/useSetState'
import { Button } from './input/button'
import { Icon } from './ui/icon'
import { useTraversal } from '../contexts'
import { useConfig } from '../hooks/useConfig'
import { useLocation } from '../hooks/useLocation'

/* eslint jsx-a11y/anchor-is-valid: "off" */
const initialState = { types: undefined }

export function CreateButton() {
  const [state, setState] = useSetState(initialState)
  const Ctx = useTraversal()
  const Config = useConfig()
  useEffect(() => {
    ;(async function anyNameFunction() {
      const types = await Ctx.client.getTypes(Ctx.path)
      setState({
        types: types.filter((item) => !Config.DisabledTypes.includes(item)),
      })
    })()
  }, [Ctx.path])

  const doAction = (item) => {
    Ctx.doAction('addItem', { type: item })
    setState({ isActive: false })
  }

  if (state.types && state.types.length === 1) {
    return (
      <Button
        className={'is-small is-success'}
        onClick={() => doAction(state.types[0])}
      >
        Add {state.types[0]}
      </Button>
    )
  }

  if (state.types && state.types.length === 0) {
    return null
  }

  // Implement some kind of filtering
  return (
    <Dropdown
      id="dropdown-menu"
      isRight
      onChange={doAction}
      options={(state.types || []).map((item) => ({ text: item, value: item }))}
    >
      <span className="icon" data-test="itemAddTypeTest">
        <i className="fas fa-plus"></i>
      </span>
    </Dropdown>
  )
}

export function ContextToolbar({ AddButton, ...props }) {
  const [location, setLocation] = useLocation()
  const ctx = useTraversal()
  const ref = React.useRef(null)

  const searchText = location.get('q')

  const onSearch = (ev) => {
    const search = ev.target[0].value
    setLocation({ q: search, tab: 'Items', page: 0 })
    // let searchParsed = parser(search);
    // ctx.setState({ search, searchParsed });
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
        <form action="" className="form" onSubmit={onSearch}>
          <div className="field has-addons">
            <div className="control">
              <input
                ref={ref}
                type="text"
                className="input is-size-7"
                placeholder="Search..."
              />
            </div>
            <div className="control">
              <button
                className="button has-background-grey-lighter is-size-7"
                type="submit"
              >
                <Icon icon="fas fa-search" />
              </button>
            </div>
          </div>
        </form>
      </div>
      {ctx.hasPerm('guillotina.AddContent') && (
        <div className="level-item">
          {AddButton !== undefined ? (
            <AddButton />
          ) : (
            <CreateButton {...props} />
          )}
        </div>
      )}
    </React.Fragment>
  )
}
