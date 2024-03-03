/*
  This hook allows to bind (remote) fields on the DOM
  to a form generated with Formbuilder.
  You can link whatever field you want...

  const [remoteFields, updateRemoteField] = useRemoteField({widget_1: ['a', 'b']})

  <Form remotes={remoteFields} onSubmit={ev => console.log(ev)}>
    <Input />
  </Form>

  <Widget onChange={updateRemoteField('widgte_1')}>

  This will add the values from a remote field into the desired widget

*/

import { useState } from 'react'
import { IndexSignature } from '../types/global'

export const useRemoteField = (
  initial: IndexSignature<string[]>
): [IndexSignature<string[]>, (name: string) => (value: string[]) => void] => {
  const [remotes, setRemote] = useState(initial)

  const updateRemote = (name: string) => (value: string[]) => {
    setRemote({
      ...remotes,
      [name]: value,
    })
  }

  return [remotes, updateRemote]
}
