import React from 'react'
import { useTraversal } from '../../contexts'
import { EditableField } from '../fields/editableField'
import { Table } from '../ui'

export function IAttachment({ properties, values }) {
  const Ctx = useTraversal()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')

  return (
    <Table
      headers={['Field', 'Value']}
      className="is-striped is-fullwidth is-size-7"
    >
      {Object.keys(properties).map((key) => (
        <tr key={'attachment_' + key}>
          <td key={1}>{key}</td>
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
