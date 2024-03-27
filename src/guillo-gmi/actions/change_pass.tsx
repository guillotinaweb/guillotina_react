import { useTraversal } from '../contexts'
import { Modal } from '../components/modal'
import { useCrudContext } from '../hooks/useCrudContext'
import { Input } from '../components/input/input'
import { Button } from '../components/input/button'
import { Form } from '../components/input/form'
import { useState } from 'react'
import { IndexSignature } from '../types/global'

const initial = {
  pass1: '',
  pass2: '',
}

export function ChangePassword() {
  const [state, setState] = useState(initial)
  const [perror, setPerror] = useState<string | undefined>(undefined)

  const Ctx = useTraversal()
  const { patch } = useCrudContext()

  const setActive = () => {
    Ctx.cancelAction()
  }

  async function doSubmit() {
    if (state.pass1 === '') {
      setPerror('provide a password')
      return
    }

    if (state.pass1 !== state.pass2) {
      setPerror("passwords doesn't match")
      return
    }

    setPerror(undefined)

    const form = {
      password: state.pass1,
    }

    const { isError, errorMessage } = await patch(form)
    if (!isError) {
      Ctx.flash('Password Changed', 'success')
    } else {
      Ctx.flash(`An error has ocurred: ${errorMessage}`, 'danger')
    }

    Ctx.cancelAction()
    Ctx.refresh()
  }

  const setPass = (field: string) => (val: string) => {
    const n: IndexSignature = {}
    n[field] = val
    setState((state) => ({ ...state, ...n }))
    setPerror(undefined)
  }

  return (
    <Modal isActive={true} setActive={setActive}>
      <Form onSubmit={doSubmit} title="Change Password">
        {perror && (
          <div className="notification is-danger is-size-7">
            <button className="delete"></button>
            {perror}
          </div>
        )}
        <Input
          id="pass"
          placeholder="New Password"
          type="password"
          value={state.pass1}
          onChange={setPass('pass1')}
        />

        <Input
          id="pass"
          placeholder="Repeat Password"
          type="password"
          value={state.pass2}
          onChange={setPass('pass2')}
        />
        <Button>Change</Button>
      </Form>
    </Modal>
  )
}
