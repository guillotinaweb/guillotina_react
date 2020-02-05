import React from 'react'
import {Confirm} from '../components/modal'
import {useContext} from 'react'
import {TraversalContext} from '../contexts'

export function MoveItems(props) {
  const Ctx = useContext(TraversalContext)
  const { items = [] } = props

  async function moveItems() {
    console.log('moveItems @todo')
    Ctx.flash(`Items moved!`, 'success')
    Ctx.refresh()
    Ctx.cancelAction()
  }

  return (
    <Confirm
      onCancel={() => Ctx.cancelAction()}
      onConfirm={moveItems}
      message={`Move items @todo`}
    />
  )
}
