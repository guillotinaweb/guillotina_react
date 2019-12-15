
import React from 'react'
import {useContext} from 'react'
import {TraversalContext} from '../contexts'
import {Modal} from '../components/modal'
import {getForm} from '../lib/registry'
import {useState} from 'react'
import { Item } from '../components/item'


export function AddItem(props) {

  const Ctx = useContext(TraversalContext)
  const {type} = props

  const Form = getForm(type)

  const setActive = () => {
    Ctx.cancelAction()
  }

  async function doSubmit(data, oldData) {
    const form = Object.assign({}, {"@type": type}, data)
    const client = Ctx.client
    const res = await client.create(Ctx.path, form)
    Ctx.flash("Content created!", 'success')
    Ctx.cancelAction()
    Ctx.refresh()
  }

  return (
    <Modal isActive={true} setActive={setActive} >
      <Form
        onSubmit={doSubmit}
        onError={(err) =>console.log(err) }
        actionName={'Add ' + type}
        title={'Add ' + type}
        type={type}
        />
    </Modal>
  )

}
