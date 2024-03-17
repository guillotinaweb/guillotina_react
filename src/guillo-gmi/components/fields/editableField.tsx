import { Button } from '../input/button'
import { useCrudContext } from '../../hooks/useCrudContext'
import { useConfig } from '../../hooks/useConfig'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { Icon } from '../ui'
import { get } from '../../lib/utils'
import { useIntl } from 'react-intl'
import {
  genericFileMessages,
  genericMessages,
} from '../../locales/generic_messages'
import { EditableFieldValue, LightFile } from '../../types/global'
import { GuillotinaItemsProperty } from '../../types/guillotina'

interface Props {
  field: string
  value: EditableFieldValue
  ns?: string
  schema?: GuillotinaItemsProperty
  modifyContent?: boolean
  required?: boolean
}

export function EditableField({
  field,
  value,
  ns,
  schema = undefined,
  modifyContent,
  required,
}: Props) {
  const intl = useIntl()
  const ref = useRef<HTMLElement>()
  const [isEdit, setEdit] = useState(false)
  const [val, setValue] = useState(value)
  const { patch, loading, Ctx } = useCrudContext()
  const { fieldHaveDeleteButton } = useConfig()

  const EditComponent = Ctx.registry.get('components', 'EditComponent')
  const RenderFieldComponent = Ctx.registry.get(
    'components',
    'RenderFieldComponent'
  )

  useEffect(() => {
    if (isEdit && ref.current) {
      ref.current.focus()
    }
  })

  const canModified =
    schema !== undefined && modifyContent && !get(schema, 'readonly', false)

  const saveField = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (ev) ev.preventDefault()

    if (!field) {
      Ctx.flash(
        intl.formatMessage(genericMessages.error_provide_key_name),
        'danger'
      )
      return
    }

    if (!val && required) {
      Ctx.flash(
        intl.formatMessage(genericMessages.mandatory_field, { field }),
        'danger'
      )
      return
    }

    if (schema?.widget === 'file') {
      const value = val as LightFile

      if (value) {
        value['filename'] = unescape(encodeURIComponent(value['filename']))
      }
      const endpoint = `${Ctx.path}@upload/${field}`
      const req = await Ctx.client.upload(endpoint, value)
      if (req.status !== 200) {
        Ctx.flash(
          intl.formatMessage(genericFileMessages.error_upload_file),
          'danger'
        )
      } else {
        Ctx.flash(
          intl.formatMessage(genericFileMessages.file_uploaded),
          'success'
        )
      }
    } else {
      const data = ns ? { [ns]: { [field]: val } } : { [field]: val }
      const dataPatch = await patch(data)
      if (dataPatch.isError) {
        Ctx.flash(
          intl.formatMessage(genericMessages.error_in_field, { field }),
          'danger'
        )
      } else {
        Ctx.flash(
          intl.formatMessage(genericMessages.field_updated, { field }),
          'success'
        )
      }
    }

    setEdit(false)
    Ctx.refresh()
  }

  const deleteField = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (ev) ev.preventDefault()
    if (schema?.widget === 'file') {
      if (!field || (!val && required)) {
        Ctx.flash(
          intl.formatMessage(genericMessages.can_not_delete_field, { field }),
          'danger'
        )
        return
      }

      const data = ns ? { [ns]: { [field]: null } } : { [field]: null }
      const dataPatch = await patch(data)
      if (dataPatch.isError) {
        Ctx.flash(
          intl.formatMessage(genericMessages.error_in_field, { field }),
          'danger'
        )
      } else {
        Ctx.flash(
          intl.formatMessage(genericMessages.field_deleted, { field }),
          'success'
        )
      }

      setEdit(false)
      Ctx.refresh()
    } else if (schema?.type === 'string' && schema?.enum) {
      setValue(null)
    } else if (schema?.type === 'array' && schema?.items.type === 'string') {
      setValue([])
    }
  }

  return (
    <>
      {!isEdit && (
        <div
          className={canModified ? 'editable' : ''}
          onClick={() => {
            setEdit(!!canModified)
          }}
          data-test={`editableFieldTest-${field}`}
        >
          <RenderFieldComponent
            schema={schema}
            field={field}
            val={val}
            modifyContent={modifyContent}
          />
          {canModified && <Icon icon="fas fa-edit" />}
        </div>
      )}

      {isEdit && (
        <div className="field" data-test={`editableFieldTest-${field}`}>
          <div className="control">
            <EditComponent
              ref={ref}
              schema={schema}
              val={val}
              setValue={setValue}
              dataTest={`editableFieldEditTest`}
            />
          </div>
          <div className="field is-grouped">
            <div className="control">
              <Button
                className="is-small is-primary"
                loading={loading}
                onClick={saveField}
                dataTest="editableFieldBtnSaveTest"
              >
                {intl.formatMessage(genericMessages.save)}
              </Button>
            </div>
            <div className="control">
              <Button
                className="is-small"
                onClick={() => setEdit(false)}
                dataTest="editableFieldBtnCancelTest"
              >
                {intl.formatMessage(genericMessages.cancel)}
              </Button>
            </div>
            {!required && schema && fieldHaveDeleteButton(schema) && (
              <div className="control">
                <Button
                  className="is-small is-danger"
                  onClick={deleteField}
                  dataTest="editableFieldBtnDeleteTest"
                >
                  {intl.formatMessage(genericMessages.delete)}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
