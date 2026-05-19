import { useEffect, useState } from 'react'

import Dropdown from './input/dropdown'
import { Button } from './input/button'
import { Icon } from './ui/icon'
import { useTraversal } from '../contexts'
import { useConfig } from '../hooks/useConfig'
import { useLocation } from '../hooks/useLocation'
import { Select } from './input/select'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'
import { getFilterInputValue } from '../types/global'

interface CreateButtonProps {
  types: string[]
}

export function CreateButton({ types }: CreateButtonProps) {
  const intl = useIntl()
  const Ctx = useTraversal()

  const doAction = (item: string) => {
    Ctx.doAction('addItem', { type: item })
  }

  if (types.length === 0) {
    return null
  }

  if (types.length === 1) {
    return (
      <Button
        className={'is-small is-success'}
        onClick={() => doAction(types[0])}
        dataTest="itemAddTypeTest"
      >
        {intl.formatMessage(genericMessages.add_type, { type: types[0] })}
      </Button>
    )
  }

  return (
    <Dropdown
      id="dropdown-menu"
      isRight
      onChange={doAction}
      options={types.map((item) => ({ text: item, value: item }))}
    >
      <span className="icon" data-test="itemAddTypeTest">
        <i className="fas fa-plus"></i>
      </span>
    </Dropdown>
  )
}

interface Props {
  AddButton?: React.FC<CreateButtonProps>
}
export function ContextToolbar({ AddButton }: Props) {
  const intl = useIntl()
  const [types, setTypes] = useState<string[]>([])
  const [location, setLocation, del] = useLocation()
  const traversal = useTraversal()
  const Config = useConfig()
  const searchText = location.get('q') || ''
  const [searchValue, setSearchValue] = useState(searchText || '')

  useEffect(() => {
    async function loadTypes() {
      const fetchedTypes: string[] = await traversal.client.getTypes(
        traversal.path
      )
      setTypes(
        fetchedTypes.filter((item) => !Config.DisabledTypes.includes(item))
      )
    }
    loadTypes()
  }, [traversal.path])

  useEffect(() => {
    setSearchValue(searchText)
  }, [searchText])

  const onSearchQuery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocation({
      q: getFilterInputValue(event.currentTarget),
      tab: 'Items',
      page: 0,
    })
  }

  const onSearchByType = (typeText: string) => {
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
                id="filterInput"
                name="filterInput"
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
          options={types.map((item) => ({
            text: item,
            value: item,
          }))}
          onChange={(value) => onSearchByType(value as string)}
        />
      </div>
      {traversal.hasPerm('guillotina.AddContent') && (
        <div className="level-item">
          {AddButton !== undefined ? (
            <AddButton types={types} />
          ) : (
            <CreateButton types={types} />
          )}
        </div>
      )}
    </>
  )
}
