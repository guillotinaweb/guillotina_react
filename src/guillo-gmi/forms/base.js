import React from 'react'
import { useState } from 'react'
import { Input } from '../components/input/input'
import { Form } from '../components/input/form'
import { stringToSlug } from '../lib/helpers'

export function BaseForm({ onSubmit, actionName, title, dataTest, loading }) {
  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [error, setError] = useState(undefined)

  const submit = () => {
    if (name === '') {
      setError('This field is required')
      return
    }
    onSubmit({ title: name, id })
  }

  const setTitle = (value) => {
    setId(stringToSlug(value))
    setName(value)
  }

  return (
    <Form title={title} onSubmit={submit} dataTest={dataTest}>
      <Input
        id="title"
        placeholder="Title"
        required
        value={name}
        onChange={setTitle}
        autofocus
        error={error}
        dataTest="titleTestInput"
      />

      <Input
        id="id"
        placeholder="Id"
        value={id}
        onChange={setId}
        dataTest="idTestInput"
      />

      <div className="level level-right">
        <button
          type="submit"
          className={`button is-success ${loading ? 'is-loading' : ''}`}
          data-test="formBaseBtnTestSubmit"
        >
          {actionName || 'Add'}
        </button>
      </div>
    </Form>
  )
}
