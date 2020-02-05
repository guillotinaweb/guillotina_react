import React, { createContext, useState, useContext } from 'react'
import Dropdown from './input/dropdown'
import { Checkbox } from './input/checkbox'
import { TraversalContext } from '../contexts'

const ItemsActionsCtx = createContext({})
const actions = {
  DELETE: { 
    text: 'Delete', 
    perms: ['guillotina.DeleteContent'], 
    action: 'removeItems' 
  },
  MOVE: {
     text: 'Move to...', 
     perms: ['guillotina.MoveContent'], 
     action: 'moveItems' 
  },
  COPY: {
    text: 'Copy to...',
    perms: ['guillotina.AddContent'],
    action: 'copyItems' 
  },
}

/**
 * Actions to apply after select some items
 * Ex: Delete, Move, Copy...
 */
export function ItemsActionsProvider({ items, children }) {
  const traversal = useContext(TraversalContext);
  const [selected, setSelected] = useState({})

  function onSelectAllItems(checked) {
    setSelected(items.reduce((obj, item) => {
      obj[item.id] = checked
      return obj
    } , { all: checked }))
  }

  function onSelectOneItem(item) {
    setSelected(state => ({
      ...state, 
      all: false,
      [item.id]: !state[item.id] 
    }))
  }

  function onAction(actionKey) {
    traversal.doAction(actions[actionKey].action, { 
      items: items.filter(item => selected[item.id])
    })
  }

  return (
    <ItemsActionsCtx.Provider value={{
      onAction,
      onSelectAllItems,
      onSelectOneItem,
      selected,
    }}>
      {children}
    </ItemsActionsCtx.Provider>
  )
}

/**
 * Checkbox component without props that consume the ItemsActionsContext 
 * and it select/unselect all items of the page.
 */
export function AllItemsCheckbox() {
  const { onSelectAllItems, selected } = useContext(ItemsActionsCtx)

  return (
     <Checkbox 
      key={selected.all}
      onChange={onSelectAllItems}
      style={{ marginLeft: 2 }}
      value={selected.all} 
     />
  )
}

/**
 * Checkbox component to select ONE item.
 */
export function ItemCheckbox({ item }) {
  const { selected, onSelectOneItem } = useContext(ItemsActionsCtx)
  const value = selected[item.id]

  return (
    <Checkbox 
      key={value}
      onChange={() => onSelectOneItem(item)}
      value={value} 
     />
  )
}

/**
 * Dropdown to choose some action to apply to the selected items.
 */
export function ItemsActionsDropdown() {
  const traversal = useContext(TraversalContext);
  const { selected, onAction } = useContext(ItemsActionsCtx)
  const disabled = Object.values(selected).every(v => !v)
  const options = Object.keys(actions)
    .map(action => ({ text: actions[action].text, value: action }))

  return (
    <Dropdown 
      disabled={disabled}
      id="items-actions" 
      onChange={onAction} 
      optionDisabledWhen={
        o => actions[o.value].perms.some(perm => !traversal.hasPerm(perm))
      }
      options={options}
    >
      Choose action...
    </Dropdown>
  )
}
