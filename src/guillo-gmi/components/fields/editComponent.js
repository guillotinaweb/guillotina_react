import React from 'react'
import { Textarea } from '../input/textarea'
import { Checkbox } from '../input/checkbox'
import { FileUpload } from '../input/upload'
import { Select } from '../input/select'
import { Input } from '../input/input'
import { get } from '../../lib/utils'
import DatePicker from 'react-datepicker'

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
    } else if (schema?.type === 'datetime') {
      return (
        <DatePicker
          showTimeInput
          timeInputLabel="Time:"
          dateFormat="dd/MM/yyyy h:mm aa"
          className="input"
          selected={val ? new Date(val) : new Date()}
          onChange={(ev) => {
            if (ev) {
              setValue(ev)
            }
          }}
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
    return (
      <Input
        value={val || ''}
        className="is-small"
        onChange={(ev) => setValue(ev)}
        ref={ref}
        type={schema?.type === 'integer' ? 'number' : 'text'}
      />
    )
  }
)

EditComponent.displayName = 'EditComponent'
export default EditComponent
