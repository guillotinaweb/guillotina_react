import React from 'react'
import {Confirm} from '../components/modal'
import {useContext} from 'react'
import {TraversalContext} from '../contexts'

export function RemoveItems(props) {
  const Ctx = useContext(TraversalContext)
  const { items = [] } = props
  const last = items[items.length - 1]['@name']
  const itemsNames = items
    .map(item => item['@name'])
    .join(', ')
    .replace(`, ${last}`, ` and ${last}`)

  async function removeItems() {
    await Promise.all(items.map(async item => {
      await Ctx.client.delete(item["@id"])
    }))
    Ctx.flash(`Items removed!`, 'success')
    Ctx.refresh()
    Ctx.cancelAction()
  }

  return (
    <Confirm
      onCancel={() => Ctx.cancelAction()}
      onConfirm={removeItems}
      message={`Are you sure to remove: ${itemsNames}?`}
    />
  )
}
