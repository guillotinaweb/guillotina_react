import React from 'react'
import { useState, useEffect } from 'react'
import { Form } from '../components/input/form'
import { stringToSlug } from '../lib/helpers'
import { useTraversal } from '../contexts'
import useSetState from '../hooks/useSetState'
import { EditComponent } from '../components/fields/editComponent'

const ignoreFiels = []
const extraFields = ['title']

export function RequiredFieldsForm({ onSubmit, actionName, title, dataTest, type }) {
  const Ctx = useTraversal()

  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  const [schema, setSchema] = useSetState({
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
        currentErrors[key] = 'This field is required'
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
          className="button is-success"
          data-test="formBaseBtnTestSubmit"
        >
          {actionName || 'Add'}
        </button>
      </div>
    </Form>
  )
}
