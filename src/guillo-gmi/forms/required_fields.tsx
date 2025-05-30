import { useState, useEffect } from 'react'
import { Form } from '../components/input/form'
import { stringToSlug } from '../lib/helpers'
import { useTraversal } from '../contexts'
import useSetState from '../hooks/useSetState'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'
import { IndexSignature } from '../types/global'

const ignoreFiels: string[] = []
const extraFields = ['title']

interface Props {
  onSubmit: (data: IndexSignature) => void
  actionName?: string
  title?: string
  dataTest?: string
  loading?: boolean
  type: string
}
interface State {
  data?: IndexSignature
  loading: boolean
  error?: unknown
  formFields: string[]
}
export function RequiredFieldsForm({
  loading,
  onSubmit,
  actionName,
  title,
  dataTest,
  type,
}: Props) {
  const intl = useIntl()
  const Ctx = useTraversal()

  const EditComponent = Ctx.registry.getComponent('EditComponent')

  const [formData, setFormData] = useState<IndexSignature>({})
  const [errors, setErrors] = useState<IndexSignature<string>>({})

  const [schema, setSchema] = useSetState<State>({
    data: undefined,
    loading: false,
    error: undefined,
    formFields: [],
  })

  useEffect(() => {
    const getSchema = async () => {
      if (!schema.loading && !schema.data && !schema.error) {
        try {
          setSchema({ loading: true })
          const dataJson = await Ctx.client.getTypeSchema(Ctx.path, type)
          setSchema({
            loading: false,
            data: dataJson,
            formFields: [...dataJson.required, ...extraFields],
          })
        } catch (err) {
          setSchema({ loading: false, error: err })
        }
      }
    }
    getSchema()
  }, [schema])

  const submit = () => {
    const currentErrors: IndexSignature<string> = {}

    schema.formFields.forEach((key) => {
      if (!formData[key]) {
        currentErrors[key] = intl.formatMessage(
          genericMessages.field_is_required
        )
      }
    })

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors)
      return
    }

    onSubmit({ id: formData.uuid, ...formData })
  }

  return (
    <Form title={title} onSubmit={submit} dataTest={dataTest}>
      {schema &&
        schema.data &&
        !schema.loading &&
        schema.formFields.map((key) => {
          if (!ignoreFiels.includes(key)) {
            const value = schema.data?.properties[key]
            return (
              <EditComponent
                key={key}
                id={key}
                placeholder={value?.title ?? ''}
                className=""
                required
                schema={schema.data?.properties[key]}
                setValue={(value: string) => {
                  if (key === 'title') {
                    setFormData({
                      ...formData,
                      uuid: stringToSlug(value),
                      [key]: value,
                    })
                  } else if (key === 'uuid') {
                    setFormData({
                      ...formData,
                      uuid: stringToSlug(value),
                    })
                  } else {
                    setFormData({ ...formData, [key]: value })
                  }
                }}
                error={errors[key]}
                dataTest={`${key}TestInput`}
                val={key in formData ? formData[key] : ''}
              />
            )
          }
          return null
        })}

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
