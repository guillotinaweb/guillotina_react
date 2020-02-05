import React from 'react'
import {Confirm} from '../components/modal'
import {useContext} from 'react'
import {TraversalContext} from '../contexts'

export function CopyItems(props) {
  const Ctx = useContext(TraversalContext)
  const { items = [] } = props

  async function copyItems() {
    console.log('copyItems @todo')
    Ctx.flash(`Items copied!`, 'success')
    Ctx.refresh()
    Ctx.cancelAction()
  }

  return (
    <Confirm
      onCancel={() => Ctx.cancelAction()}
      onConfirm={copyItems}
      message="Copy items @todo"
    />
  )
}
