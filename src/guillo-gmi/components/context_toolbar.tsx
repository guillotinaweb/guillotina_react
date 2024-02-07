import { useEffect, useState } from 'react'

import Dropdown from './input/dropdown'
import useSetState from '../hooks/useSetState'
import { Button } from './input/button'
import { Icon } from './ui/icon'
import { useTraversal } from '../contexts'
import { useConfig } from '../hooks/useConfig'
import { useLocation } from '../hooks/useLocation'
import { Select } from './input/select'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

interface State {
  types?: string[]
  isActive?: boolean
}
const initialState = { types: undefined }

export function CreateButton() {
  const intl = useIntl()
  const [state, setState] = useSetState<State>(initialState)
  const Ctx = useTraversal()
  const Config = useConfig()
  useEffect(() => {
    async function anyNameFunction() {
      const types = await Ctx.client.getTypes(Ctx.path)
      setState({
        types: types.filter((item) => !Config.DisabledTypes.includes(item)),
      })
    }
    anyNameFunction()
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
        {intl.formatMessage(genericMessages.add_type, { type: state.types[0] })}
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

interface Props {
  AddButton?: React.FC
}
export function ContextToolbar({ AddButton }: Props) {
  const intl = useIntl()
  const [state, setState] = useSetState<State>(initialState)
  const [location, setLocation, del] = useLocation()
  const traversal = useTraversal()
  const Config = useConfig()
  const searchText = location.get('q')
  const [searchValue, setSearchValue] = useState(searchText || '')

  useEffect(() => {
    loadTypes()
  }, [traversal.path])

  useEffect(() => {
    setSearchValue(searchText)
  }, [searchText])

  async function loadTypes() {
    const types = await traversal.client.getTypes(traversal.path)
    setState({
      types: types.filter((item) => !Config.DisabledTypes.includes(item)),
    })
  }

  const onSearchQuery = (ev) => {
    const search = ev.target[0].value
    setLocation({ q: search, tab: 'Items', page: 0 })
    ev.preventDefault()
  }

  const onSearchByType = (typeText) => {
    if (typeText && typeText !== '') {
      setLocation({ type: typeText, tab: 'Items', page: 0 })
    } else {
      del('type')
    }
  }

  return (
    <>
      <div className="level-item">
        <form action="" className="form" onSubmit={onSearchQuery}>
          <div className="field has-addons">
            <div className="control">
              <input
                value={searchValue || ''}
                onChange={(ev) => setSearchValue(ev.target.value)}
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
          {AddButton !== undefined ? <AddButton /> : <CreateButton />}
        </div>
      )}
    </>
  )
}
