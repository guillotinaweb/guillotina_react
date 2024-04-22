import { useState } from 'react'
import { Input } from '../components/input/input'
import { Form } from '../components/input/form'
import { stringToSlug } from '../lib/helpers'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

export interface BaseFormProps {
  onSubmit: (data: { title: string; id: string }) => void
  actionName?: string
  title?: string
  dataTest?: string
  loading?: boolean
  type: string
}
export function BaseForm({
  onSubmit,
  actionName,
  title,
  dataTest,
  loading,
}: BaseFormProps) {
  const intl = useIntl()
  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  const submit = () => {
    if (name === '') {
      setError(intl.formatMessage(genericMessages.field_is_required))
      return
    }
    onSubmit({ title: name, id })
  }

  const setTitle = (value: string) => {
    setId(stringToSlug(value))
    setName(value)
  }

  return (
    <Form title={title} onSubmit={submit} dataTest={dataTest}>
      <Input
        id="title"
        placeholder={intl.formatMessage(genericMessages.title)}
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
          {actionName || intl.formatMessage(genericMessages.add)}
        </button>
      </div>
    </Form>
  )
}
