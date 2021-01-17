import React from 'react'
import { Textarea } from '../input/textarea'
import { Checkbox } from '../input/checkbox'
import { FileUpload } from '../input/upload'
import { Select } from '../input/select'
import { Input } from '../input/input'
import { get } from '../../lib/utils'

export const EditComponent = React.forwardRef(
  ({ schema, val, setValue }, ref) => {
    if (schema?.widget === 'textarea' || schema?.widget === 'richtext') {
      return (
        <Textarea
          value={val || ''}
          className="is-small"
          onChange={(ev) => setValue(ev)}
          ref={ref}
        />
      )
    } else if (schema?.type === 'boolean') {
      return (
        <Checkbox
          value={!!val}
          className="is-small"
          onChange={(ev) => setValue(ev)}
          ref={ref}
        />
      )
    } else if (schema?.widget === 'file') {
      return (
        <FileUpload
          onChange={(ev) => setValue(ev)}
          label={get(val, 'filename', null)}
        />
      )
    } else if (schema?.widget === 'select') {
      return (
        <Select
          value={val || ''}
          className="is-small"
          appendDefault
          options={schema?.vocabulary.map((item) => {
            return {
              text: item,
              value: item,
            }
          })}
          onChange={(ev) => {
            const selectValue = get(ev, 'target.value', '')
            return setValue(selectValue)
          }}
        />
      )
    }
    const getInputType = () => {
      switch (schema?.type) {
        case 'integer':
          return 'number'
        case 'datetime':
          return 'datetime-local'
        default:
          return 'text'
      }
    }
    return (
      <Input
        value={val || ''}
        className="is-small"
        onChange={(ev) => setValue(ev)}
        ref={ref}
        type={getInputType()}
      />
    )
  }
)

EditComponent.displayName = 'EditComponent'
export default EditComponent
