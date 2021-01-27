import React, { useEffect } from 'react'
import { ItemModel } from '../../models'
import { BehaviorsView } from '../behavior_view'
import { Icon } from '../ui/icon'
import { EditableField } from '../fields/editableField'
import { PropertiesButtonView } from '../properties_view'
import { PropertiesView } from '../properties_view'
import { useConfig } from '../../hooks/useConfig'
import useSetState from '../../hooks/useSetState'
import { useTraversal } from '../../contexts'
import { get } from '../../lib/utils'

const _showProperties = ['@id', '@name', '@uid']
const _ignoreFields = [
  'guillotina.behaviors.dublincore.IDublinCore',
  '__behaviors__',
  'type_name',
  'creation_date',
  'modification_date',
  'uuid',
  'title',
]

export function PanelProperties() {
  const Ctx = useTraversal()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')
  const cfg = useConfig()

  const [schema, setSchema] = useSetState({
    data: undefined,
    loading: false,
    error: undefined,
  })

  const model = new ItemModel(Ctx.context)

  const showProperties = cfg.properties_default || _showProperties
  const ignoreFields = cfg.properties_ignore_fields || _ignoreFields

  useEffect(() => {
    ;(async () => {
      if (!schema.loading && !schema.data && !schema.error) {
        try {
          setSchema({ loading: true })
          const dataJson = await Ctx.client.getTypeSchema(Ctx.path, model.type)
          setSchema({ loading: false, data: dataJson })
        } catch (err) {
          setSchema({ loading: false, error: err })
        }
      }
    })()
  }, [schema])

  return (
    <div className="container">
      <div className="level">
        <div className="level-left">
          <h2 className="title is-size-4 is-primary">
            <Icon icon={model.icon} align="is-left" className="has-text-grey" />{' '}
            &nbsp;
            <span>{Ctx.context.title || Ctx.context['@name']}</span>
          </h2>
        </div>
        <div className="level-right">
          <PropertiesButtonView />
        </div>
      </div>

      <hr />
      {schema && schema.data && !schema.loading && (
        <div className="columns">
          <div className="column">
            <table className="table is-striped is-fullwidth is-size-7">
              <thead>
                <tr>
                  <th className="is-2">Prop</th>
                  <th className="is-8">Value</th>
                </tr>
              </thead>
              <tbody>
                {showProperties.map((prop) => (
                  <tr key={'prop' + prop}>
                    <td>{prop}</td>
                    <td>
                      <EditableField
                        field={prop}
                        value={Ctx.context[prop]}
                        modifyContent={false}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table is-striped is-fullwidth is-size-7">
              <thead>
                <tr>
                  <th className="is-2">Prop</th>
                  <th className="is-8">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(schema.data.properties).map((key) => {
                  const value = schema.data.properties[key]
                  if (!ignoreFields.includes(key)) {
                    return (
                      <tr key={'prop' + key}>
                        <td>{value.title}</td>
                        <td>
                          <EditableField
                            field={key}
                            value={Ctx.context[key]}
                            schema={value}
                            modifyContent={modifyContent}
                            required={get(schema.data, 'required', []).includes(
                              key
                            )}
                          />
                        </td>
                      </tr>
                    )
                  }
                  return null
                })}
              </tbody>
            </table>
            <PropertiesView />
            <BehaviorsView context={Ctx.context} schema={schema.data} />
          </div>
        </div>
      )}
    </div>
  )
}
