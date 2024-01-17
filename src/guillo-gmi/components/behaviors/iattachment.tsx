/* eslint-disable @typescript-eslint/no-explicit-any */

import { useTraversal } from '../../contexts'
import { EditableField } from '../fields/editableField'
import { Table } from '../ui'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'

interface Props {
  properties: { [key: string]: any }
  values: { [key: string]: any }
}

export function IAttachment({ properties, values }: Props) {
  const intl = useIntl()
  const Ctx = useTraversal()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')

  return (
    <Table
      headers={[
        intl.formatMessage(genericMessages.property),
        intl.formatMessage(genericMessages.value),
      ]}
      className="is-striped is-fullwidth is-size-7"
    >
      {Object.keys(properties).map((key) => (
        <tr key={'attachment_' + key}>
          <td style={{ width: '150px' }} key={1}>
            {key}
          </td>
          <td key={2}>
            <EditableField
              field={key}
              value={values[key]}
              ns="guillotina.behaviors.attachment.IAttachment"
              schema={properties[key]}
              modifyContent={modifyContent && ['file'].includes(key)}
            />
          </td>
        </tr>
      ))}
    </Table>
  )
}
