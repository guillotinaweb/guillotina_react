import { createContext, useState, useContext } from 'react'
import Dropdown from './input/dropdown'
import { Checkbox } from './input/checkbox'
import { useTraversal } from '../contexts'
import { useIntl } from 'react-intl'
import { getActionsObject } from '../lib/helpers'
import { SearchItem } from '../types/guillotina'

const ItemsActionsCtx = createContext<{
  selected?: {
    all: boolean
    [key: string]: boolean
  }
  onSelectOneItem?: (item: SearchItem) => void
  onSelectAllItems?: (chedked: boolean) => void
  onAction?: (action: string) => void
}>({
  selected: {
    all: false,
  },
})

/**
 * Actions to apply after select some items
 * Ex: Delete, Move, Copy...
 */
interface PropsItemsActionsProvider {
  items: SearchItem[]
  children: React.ReactNode
}
export function ItemsActionsProvider({
  items,
  children,
}: PropsItemsActionsProvider) {
  const intl = useIntl()
  const actions = getActionsObject(intl, true)
  const traversal = useTraversal()
  const [selected, setSelected] = useState({
    all: false,
  })
  function onSelectAllItems(checked) {
    setSelected(
      items.reduce(
        (obj, item) => {
          obj[`${item.path}/${item.id}`] = checked
          return obj
        },
        { all: checked }
      )
    )
  }

  function onSelectOneItem(item) {
    setSelected((state) => ({
      ...state,
      all: false,
      [`${item.path}/${item.id}`]: !state[`${item.path}/${item.id}`],
    }))
  }

  function onAction(actionKey) {
    traversal.doAction(actions[actionKey].action, {
      items: items.filter((item) => selected[`${item.path}/${item.id}`]),
    })
  }

  return (
    <ItemsActionsCtx.Provider
      value={{
        onAction,
        onSelectAllItems,
        onSelectOneItem,
        selected,
      }}
    >
      {children}
    </ItemsActionsCtx.Provider>
  )
}

/**
 * Checkbox component without props that consume the ItemsActionsContext
 * and it select/unselect all items of the page.
 */
export function AllItemsCheckbox({ dataTest }: { dataTest?: string }) {
  const { onSelectAllItems, selected } = useContext(ItemsActionsCtx)

  return (
    <Checkbox
      onChange={onSelectAllItems}
      checked={selected.all}
      dataTest={dataTest}
    />
  )
}

/**
 * Checkbox component to select ONE item.
 */
interface PropsItemCheckbox {
  item: SearchItem
  dataTest?: string
}
export function ItemCheckbox({ item, dataTest }: PropsItemCheckbox) {
  const { selected, onSelectOneItem } = useContext(ItemsActionsCtx)
  const absId = `${item.path}/${item.id}`
  const value = selected[absId]

  return (
    <Checkbox
      onChange={() => onSelectOneItem(item)}
      checked={value}
      dataTest={dataTest}
    />
  )
}

/**
 * Dropdown to choose some action to apply to the selected items.
 */
export function ItemsActionsDropdown() {
  const intl = useIntl()
  const ACTIONS_OBJECT = getActionsObject(intl, true)
  const traversal = useTraversal()
  const { selected, onAction } = useContext(ItemsActionsCtx)
  const disabled = Object.values(selected).every((v) => !v)
  const options = Object.keys(ACTIONS_OBJECT).map((action) => ({
    text: ACTIONS_OBJECT[action].text,
    value: action,
  }))

  return (
    <Dropdown
      disabled={disabled}
      id="items-actions"
      onChange={onAction}
      optionDisabledWhen={(o) =>
        ACTIONS_OBJECT[o.value].perms.some((perm) => !traversal.hasPerm(perm))
      }
      options={options}
      isRight={false}
    >
      <div data-test="btnChooseActionTest">
        {intl.formatMessage({
          id: 'choose_action',
          defaultMessage: 'Choose action...',
        })}
      </div>
    </Dropdown>
  )
}
