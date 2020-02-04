import React, { createContext, useState, useContext } from 'react'
import Dropdown from './input/dropdown'
import { Checkbox } from './input/checkbox'
import { TraversalContext } from '../contexts'

const ItemsActionsCtx = createContext({})
const [DELETE, MOVE, COPY] = [0, 1, 2]
const permissions = {
  [DELETE]: ['guillotina.DeleteContent'],
  [MOVE]: ['guillotina.MoveContent'],
  [COPY]: ['guillotina.AddContent'],
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

  function getActionItems() {
    return items.filter(item => selected[item.id])
  }

  function onDelete() {
    traversal.doAction('removeItems', { items: getActionItems() })
  }

  function onMove() {
    // @todo
    console.log('onMove')
  }

  function onCopy() {
    // @todo
    console.log('onCopy')
  }

  return (
    <ItemsActionsCtx.Provider value={{
      onCopy,
      onDelete,
      onMove,
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
  const { selected, onDelete, onMove, onCopy } = useContext(ItemsActionsCtx)
  const disabled = Object.values(selected).every(v => !v)
  const options = [
    { text: 'Delete', value: DELETE },
    { text: 'Move to...', value: MOVE },
    { text: 'Copy to...', value: COPY },
  ]

  function onAction(action) {
    switch(action){
      case DELETE: return onDelete()
      case MOVE: return onMove()
      case COPY: return onCopy()
      default: return
    }
  }

  function disableOptionWhen(option) {
    const perms = permissions[option.value]
    return perms.some(perm => !traversal.hasPerm(perm))
  }
  
  return (
    <Dropdown 
      disabled={disabled}
      id="items-actions" 
      onChange={onAction} 
      optionDisabledWhen={disableOptionWhen}
      options={options}
    >
      Choose action...
    </Dropdown>
  )
}
