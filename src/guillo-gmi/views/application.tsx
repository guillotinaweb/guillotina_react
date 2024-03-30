import { Item } from '../components/item'
import { ItemTitle } from '../components/item'
import { Button } from '../components/input/button'
import { useState } from 'react'
import { useTraversal } from '../contexts'
import { Modal } from '../components/modal'
import { Form } from '../components/input/form'
import { Input } from '../components/input/input'
import { defineMessages, useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'
import { GuillotinaApplication, GuillotinaDatabase } from '../types/guillotina'

export function ApplicationCtx() {
  const intl = useIntl()
  const traversal = useTraversal()
  const appContext = traversal.state.context as GuillotinaApplication
  const { databases } = appContext
  return (
    <>
      <h3>
        {intl.formatMessage({
          id: 'databases',
          defaultMessage: 'Databases',
        })}
      </h3>
      <div className="container">
        <ItemTitle title="Objects" />
        {databases.map((db) => (
          <Item
            item={{ id: db, path: `/${db}/` }}
            key={db}
            icon={'fas fa-database'}
          />
        ))}
      </div>
    </>
  )
}

export function DatabaseCtx() {
  const traversal = useTraversal()
  const { containers } = traversal.state.context as GuillotinaDatabase
  const { path } = traversal.state
  return (
    <>
      <div className="container">
        <ItemTitle title="Containers" actions={<CreateContainer />} />
        <table className="table is-fullwidth is-hoverable">
          <tbody>
            {containers.map((db) => (
              <Item
                item={{ id: db, path: `${path}${db}/` }}
                key={db}
                icon={'fas fa-archive'}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function CreateContainer() {
  const intl = useIntl()
  const [isActive, setActive] = useState(false)

  return (
    <>
      <ModalAddContainer isActive={isActive} setActive={setActive} />
      <button
        className="button is-warning is-pulled-right"
        onClick={() => setActive(true)}
      >
        <span className="icon is-small">
          <i className="fas fa-plus"></i>
        </span>
        <span>{intl.formatMessage(genericMessages.create)}</span>
      </button>
    </>
  )
}

export const messages = defineMessages({
  add_container: {
    id: 'add_container',
    defaultMessage: 'Add Container',
  },
  container_created: {
    id: 'container_created',
    defaultMessage: 'Container Created',
  },
})

interface ModalAddContainerProps {
  isActive: boolean
  setActive: (value: boolean) => void
}
function ModalAddContainer({ isActive, setActive }: ModalAddContainerProps) {
  const intl = useIntl()
  const Ctx = useTraversal()
  const [isLoading, setLoading] = useState(false)
  const [idField, setId] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  async function createContainer() {
    setLoading(true)
    const data = {
      '@type': 'Container',
      id: idField,
    }
    try {
      const res = await Ctx.client.createObject(Ctx.path, data)
      const result = await res.json()
      if (res.status === 200) {
        Ctx.refresh()
        setId('')
        setLoading(false)
        setActive(false)
        Ctx.flash(intl.formatMessage(messages.container_created), 'primary')
      } else {
        setId('')
        setLoading(false)
        setError(result.message)
      }
    } catch {
      setError('Error-submitting-form')
      setLoading(false)
    }
  }

  return (
    <Modal isActive={isActive} setActive={setActive}>
      <Form
        onSubmit={createContainer}
        title={intl.formatMessage(messages.add_container)}
        error={error}
      >
        <Input
          required
          placeholder="Container Name"
          onChange={(v) => {
            setId(v)
          }}
          value={idField}
          loading={isLoading}
        />
        <Button loading={isLoading}>
          {intl.formatMessage(messages.add_container)}
        </Button>
      </Form>
    </Modal>
  )
}
