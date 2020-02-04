import React, { createContext, useState, useContext } from 'react'
import Dropdown from './input/dropdown'
import { Checkbox } from './input/checkbox'

// Context
const ItemsActionsCtx = createContext({})
const [DELETE, MOVE, COPY] = [0, 1, 2]

// Context provider
export function ItemsActionsProvider({ items, children }) {
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

  function onDelete() {

  }

  function onMove() {

  }

  function onAction(e) {
    console.log('onAction', e)
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
 * On select all items
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
 * On select one item
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

// traversal.hasPerm("guillotina.DeleteContent")
export function ItemsActions() {
  const { selected, onAction } = useContext(ItemsActionsCtx)
  const disabled = Object.values(selected).every(v => !v)
  const options = [
    { text: 'Delete', value: DELETE },
    { text: 'Move to...', value: MOVE },
    { text: 'Copy to...', value: COPY },
  ]
  
  return (
    <Dropdown 
      disabled={disabled} 
      id="items-actions" 
      onChange={onAction} 
      options={options}
      style={{ marginLeft: 'auto' }} 
    >
      Choose action...
    </Dropdown>
  )
}
