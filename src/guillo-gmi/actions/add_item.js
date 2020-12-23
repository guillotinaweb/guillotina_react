import React from 'react'
import { useTraversal } from '../contexts'
import { Modal } from '../components/modal'
import { getErrorMessage } from '../lib/utils'

export function AddItem(props) {
  const Ctx = useTraversal()
  const { type } = props
  const { getForm } = Ctx.registry

  const Form = getForm(type)

  const setActive = () => {
    Ctx.cancelAction()
  }

  async function doSubmit(data) {
    const form = Object.assign(
      {},
      { '@type': type },
      data.formData ? data.formData : data
    )
    const client = Ctx.client
    const res = await client.create(Ctx.path, form)
    if(res.ok){
      Ctx.flash('Content created!', 'success')
    } else {
      const data = await res.json()
      Ctx.flash(`An error has ocurred: ${getErrorMessage(data)}`, 'danger') 
    }
    
    Ctx.cancelAction()
    Ctx.refresh()
  }

  return (
    <Modal isActive={true} setActive={setActive}>
      <Form
        onSubmit={doSubmit}
        onError={(err) => console.log(err)}
        actionName={'Add ' + type}
        title={'Add ' + type}
        type={type}
      />
    </Modal>
  )
}
