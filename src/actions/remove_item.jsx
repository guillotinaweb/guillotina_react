import React from 'react'
import {Confirm} from '../components/modal'
import {useContext} from 'react'
import {TraversalContext} from '../contexts'


export function RemoveItem(props) {

  const Ctx = useContext(TraversalContext)
  const {item} = props

  async function removeItem() {
    await Ctx.client.delete(item["@id"])
    Ctx.flash(`Item ${item["@name"]} removed!`, 'success')
    Ctx.refresh()
    Ctx.cancelAction() // hide the modal
  }


  return (
    <Confirm
      onCancel={Ctx.cancelAction}
      onConfirm={() => removeItem()}
      message={"Are you sure to remove: " + item["@name"] + "?"}
    />
  )

}
