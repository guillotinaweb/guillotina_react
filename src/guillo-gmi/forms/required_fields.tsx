import { useState, useEffect } from 'react'
import { Form } from '../components/input/form'
import { stringToSlug } from '../lib/helpers'
import { useTraversal } from '../contexts'
import useSetState from '../hooks/useSetState'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'
import { IndexSignature } from '../types/global'

const ignoreFiels = []
const extraFields = ['title']

interface Props {
  onSubmit: (data: { [key: string]: any }) => void
  actionName?: string
  title?: string
  dataTest?: string
  loading?: boolean
  type: string
}
interface State {
  data: any
  loading: boolean
  error: any
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

  const EditComponent = Ctx.registry.get('components', 'EditComponent')

  const [formData, setFormData] = useState<IndexSignature>({})
  const [errors, setErrors] = useState({})

  const [schema, setSchema] = useSetState<State>({
    data: undefined,
    loading: false,
    error: undefined,
    formFields: [],
  })

  useEffect(() => {
    ;(async () => {
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
    })()
  }, [schema])

  const submit = () => {
    const currentErrors = {}

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
            const value = schema.data.properties[key]
            return (
              <EditComponent
                key={key}
                id={key}
                placeholder={value?.title ?? ''}
                className=""
                required
                schema={schema.data.properties[key]}
                setValue={(ev) => {
                  if (key === 'title') {
                    setFormData({
                      ...formData,
                      uuid: stringToSlug(ev),
                      [key]: ev,
                    })
                  } else if (key === 'uuid') {
                    setFormData({
                      ...formData,
                      uuid: stringToSlug(ev),
                    })
                  } else {
                    setFormData({ ...formData, [key]: ev })
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
