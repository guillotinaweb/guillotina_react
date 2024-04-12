import { useEffect } from 'react'
import { ItemModel } from '../../models'
import { BehaviorsView } from '../behavior_view'
import { Icon } from '../ui/icon'
import { EditableField } from '../fields/editableField'
import { PropertiesButtonView } from '../properties_view'
import { PropertiesView } from '../properties_view'
import { useConfig } from '../../hooks/useConfig'
import useSetState from '../../hooks/useSetState'
import { useTraversal } from '../../contexts'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'
import {
  GuillotinaSchema,
  GuillotinaSchemaProperty,
} from '../../types/guillotina'
import { get } from '../../lib/utils'

const _showProperties = ['@id', '@name', '@uid']
const _ignoreFields = [
  'guillotina.behaviors.dublincore.IDublinCore',
  'guillotina.behaviors.attachment.IAttachment',
  'guillotina.behaviors.attachment.IMultiAttachment',
  'guillotina.contrib.workflows.interfaces.IWorkflowBehavior',
  'guillotina.contrib.image.behaviors.IImageAttachment',
  'guillotina.contrib.image.behaviors.IMultiImageAttachment',
  'guillotina.contrib.image.behaviors.IMultiImageOrderedAttachment',
  '__behaviors__',
  'type_name',
  'creation_date',
  'modification_date',
  'uuid',
  'title',
]

interface State {
  data?: GuillotinaSchema
  loading: boolean
  error: string | unknown
}

export function PanelProperties() {
  const intl = useIntl()
  const Ctx = useTraversal()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')
  const cfg = useConfig()

  const [schema, setSchema] = useSetState<State>({
    data: undefined,
    loading: false,
    error: undefined,
  })

  const model = new ItemModel(Ctx.context)

  const showProperties: string[] =
    Ctx.registry.getProperties(Ctx.context['@type']).default ||
    cfg.properties_default ||
    _showProperties

  const ignoreFields =
    Ctx.registry.getProperties(Ctx.context['@type']).ignoreField ||
    cfg.properties_ignore_fields ||
    _ignoreFields

  const properties = Object.keys(schema?.data?.properties || [])
    .filter((key) => !ignoreFields.includes(key))
    .map((key) => ({
      key,
      value: schema?.data?.properties[key] as GuillotinaSchemaProperty,
    }))

  useEffect(() => {
    async function getSchema() {
      if (!schema.loading && !schema.data && !schema.error) {
        try {
          setSchema({ loading: true })
          const dataJson = await Ctx.client.getTypeSchema(
            Ctx.path,
            Ctx.context.type_name
          )
          setSchema({ loading: false, data: dataJson })
        } catch (err) {
          setSchema({ loading: false, error: err })
        }
      }
    }
    getSchema()
  }, [schema])

  return (
    <div className="container">
      <div className="level">
        <div className="level-left">
          <h2 className="title is-size-4 is-primary">
            <Icon icon={model.icon} align="is-left" className="has-text-grey" />
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
                  <th style={{ width: '150px' }} className="is-2">
                    {intl.formatMessage(genericMessages.property)}
                  </th>
                  <th className="is-8">
                    {intl.formatMessage(genericMessages.value)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {showProperties.map((prop) => (
                  <tr key={'prop' + prop}>
                    <td style={{ width: '150px' }}>{prop}</td>
                    <td>
                      <EditableField
                        field={prop}
                        value={get(Ctx.context, prop, '')}
                        modifyContent={false}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {properties.length > 0 && (
              <table className="table is-striped is-fullwidth is-size-7">
                <thead>
                  <tr>
                    <th style={{ width: '150px' }} className="is-2">
                      {intl.formatMessage(genericMessages.property)}
                    </th>
                    <th className="is-8">
                      {intl.formatMessage(genericMessages.value)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(({ key, value }) => {
                    return (
                      <tr key={'prop' + key}>
                        <td style={{ width: '150px' }}>{value.title || key}</td>
                        <td>
                          <EditableField
                            field={key}
                            value={get(Ctx.context, key, '')}
                            schema={value}
                            modifyContent={modifyContent}
                            required={(schema.data?.required ?? []).includes(
                              key
                            )}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
            <PropertiesView />
            <BehaviorsView context={Ctx.context} schema={schema.data} />
          </div>
        </div>
      )}
    </div>
  )
}
