import React from 'react'
import { Input } from '../input/input'
import { Button } from '../input/button'
import { useCrudContext } from '../../hooks/useCrudContext'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { Icon } from '../ui'
import {getErrorMessage} from '../../lib/utils'

export function EditableField({ field, value, Type = Input, ns }) {
  const ref = useRef()
  const [isEdit, setEdit] = useState(false)
  const { patch, loading, Ctx } = useCrudContext()
  const [val, setValue] = useState(value)

  const saveField = async (ev) => {
    if (ev) ev.preventDefault()
    const data = ns ? { [ns]: { [field]: val } } : { [field]: val }
    const {response: responsePatch} = await patch(data)
    if(responsePatch.ok){
      Ctx.flash(`Field ${field}, updated!`, 'success')
    } else {
      const data = await responsePatch.json()
      Ctx.flash(`Failed to update file ${field}!: ${getErrorMessage(data)}`, "danger");
    }
    
    Ctx.refresh()
    setEdit(false)
  }

  useEffect(() => {
    if (isEdit && ref.current) {
      ref.current.focus()
    }
  })

  return (
    <React.Fragment>
      {!isEdit && (
        <div className="editable" onClick={() => setEdit(true)}>
          {value || 'Click to edit'}
          <Icon icon="fas fa-edit" />
        </div>
      )}

      {isEdit && (
        <div className="field">
          <form onSubmit={saveField}>
            <div className="control">
              <Type
                value={val || ''}
                className="is-small"
                onChange={(ev) => setValue(ev)}
                ref={ref}
              />
            </div>
            <div className="field is-grouped">
              <div className="control">
                <Button
                  className="is-small is-primary"
                  loading={loading}
                  onClick={saveField}
                >
                  Save
                </Button>
              </div>
              <div className="control">
                <Button className="is-small" onClick={() => setEdit(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </React.Fragment>
  )
}
