import React from 'react'
import { useTraversal } from '../../contexts'
import { EditableField } from '../fields/editableField'

const editableFields = [
  'title',
  'description',
  'effective_date',
  'expiration_date',
]

export function IDublinCore({ properties, values }) {
  const Ctx = useTraversal()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')

  return (
    <React.Fragment>
      {Object.keys(properties).map((key) => (
        <tr key={'dublin_' + key}>
          <td key={1}>{key}</td>
          <td key={2}>
            <EditableField
              field={key}
              value={values[key]}
              ns="guillotina.behaviors.dublincore.IDublinCore"
              schema={properties[key]}
              modifyContent={modifyContent && editableFields.includes(key)}
            />
          </td>
        </tr>
      ))}
    </React.Fragment>
  )
}
