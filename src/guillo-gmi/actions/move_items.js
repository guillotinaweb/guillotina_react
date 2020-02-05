import React from 'react'
import {PathTree} from '../components/modal'
import {useContext} from 'react'
import {TraversalContext} from '../contexts'

const withError = res => res.status >= 300

export function MoveItems(props) {
  const Ctx = useContext(TraversalContext)
  const { items = [] } = props

  async function moveItems(path) {  
    console.log(items) 
    const responses = await Promise.all(items.map(item => {
      return Ctx.client.post(`${Ctx.path}${item['@name']}/@move`, {
        destination: path,
        new_id: item['@name']
      });
    }))

    Ctx.refresh()
    Ctx.cancelAction()

    if(responses.every(withError)) {
      Ctx.flash(`Oops! Items can't be moved to ${path}`, 'danger')
      return
    }

    if(responses.some(withError)) {
      Ctx.flash(`Some items are not moved correctly!`, 'warning')
      return
    }

    Ctx.flash(`Items moved!`, 'success')
  }

  return (
    <PathTree
      title="Move to..."
      onConfirm={moveItems}
      onCancel={() => Ctx.cancelAction()}
    />
  )
}
