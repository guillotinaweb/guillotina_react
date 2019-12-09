import React from 'react';

import {Item} from '../components/item'
import {ItemTitle} from '../components/item'
import {Button} from 'bloomer'
import {Notification} from 'bloomer'
import {Label, Control, Input, Field} from 'bloomer'
import {useState} from 'react'
import {useContext} from 'react'
import {FlashContext} from '../contexts'
import {Modal} from '../components/modal'


export function ApplicationCtx(props) {
  const {databases} = props.state.context
  return (
    <>
      <h3>Databases</h3>
      <div className="container">
      <ItemTitle title="Objects" />
      {databases.map(db =>
        <Item item={{'id': db, path: `/${db}/`}}
          key={db} icon={'fas fa-database'}
          setPath={props.setPath} />
      )}
      </div>
    </>
  )
}


export function DatabaseCtx({state, client, ...props}) {
  const {containers} = state.context
  const {path} = state
  return (
    <>
      <div className="container">
      <ItemTitle title="Containers"
        actions={<CreateContainer
          client={client} state={state} setPath={props.setPath} />} />
      <table className="table is-fullwidth is-hoverable">
      {containers.map(db =>
        <Item item={{'id': db, path: `${path}${db}/`}}
          key={db} icon={'fas fa-archive'}
          setPath={props.setPath} />
      )}
      </table>
      </div>
    </>
  )
}


export function CreateContainer(props) {

  const [isActive, setActive] = useState(false)

  return (
    <>
      <ModalAddContainer
        isActive={isActive}
        setActive={setActive}
        {...props}
        />
      <button className="button is-warning is-pulled-right"
        onClick={() => setActive(true)}>
        <span className="icon is-small">
          <i className='fas fa-plus'></i>
        </span>
        <span>Create</span>
      </button>
    </>
  )
}


function ModalAddContainer({isActive, setActive, client, state, setPath}) {

  const [isLoading, setLoading] = useState(false)
  const [idField, setId] = useState('')
  const [error, setError] = useState(undefined)
  const flashMessage = useContext(FlashContext)

  async function createContainer(ev) {
    setLoading(true)
    const data = {
      "@type": 'Container',
      id: idField,
    }
    const res = await client.createObject(state.path, data)
    const result = await res.json()
    if (res.status === 200) {
      // TODO set flash message via context
      setPath(state.path)
      setId('')
      setLoading(false)
      setActive(false)
      flashMessage('Container created', 'primary')
    } else {
      setId('')
      setLoading(false)
      setError(result.message)
    }


  }

  return (
    <Modal isActive={isActive} setActive={setActive}>
      <>
        {error && <Notification isColor='danger'>{error}</Notification>}
        <Field>
          <Label>Create Container</Label>
            <Control>
              <Input type="text"
                placeholder='Container ID'
                value={idField}
                onChange={(ev) => setId(ev.target.value)}
                onFocus={() => setError(undefined)} />
            </Control>
          </Field>
          <Field>
            <Control>
              <Button isColor='primary'
                isLoading={isLoading}
                onClick={createContainer}>Create</Button>
            </Control>
          </Field>
      </>
  </Modal>
  )
}
