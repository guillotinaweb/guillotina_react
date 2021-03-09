import React from 'react'
import { useEffect } from 'react'

import Dropdown from './input/dropdown'
import useSetState from '../hooks/useSetState'
import { Button } from './input/button'
import { Icon } from './ui/icon'
import { useTraversal } from '../contexts'
import { useConfig } from '../hooks/useConfig'
import { useLocation } from '../hooks/useLocation'
import { Select } from './input/select'

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
        dataTest="itemAddTypeTest"
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
  const [state, setState] = useSetState(initialState)
  const [location, setLocation, del] = useLocation()
  const traversal = useTraversal()
  const ref = React.useRef(null)
  const Config = useConfig()

  const searchText = location.get('q')

  useEffect(() => {
    ;(async () => {
      const types = await traversal.client.getTypes(traversal.path)
      setState({
        types: types.filter((item) => !Config.DisabledTypes.includes(item)),
      })
    })()
  }, [traversal.path])

  const onSearchQuery = (ev) => {
    const search = ev.target[0].value
    setLocation({ q: search, tab: 'Items', page: 0 })
    ev.preventDefault()
  }

  const onSearchByType = (ev) => {
    const typeText = ev.target.value
    if (typeText && typeText !== '') {
      setLocation({ type: typeText, tab: 'Items', page: 0 })
    } else {
      del('type')
    }
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
      <div className="level-item">
        <Select
          appendDefault
          dataTest="selectFilterTypeTest"
          classWrap="is-size-7"
          options={(state.types || []).map((item) => ({
            text: item,
            value: item,
          }))}
          onChange={onSearchByType}
        />
      </div>
      {traversal.hasPerm('guillotina.AddContent') && (
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
