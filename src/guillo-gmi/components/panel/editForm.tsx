import { useEffect, useMemo, useCallback } from 'react'
import { useTraversal } from '../../contexts'
import { useConfig } from '../../hooks/useConfig'
import { useFormState } from '../../hooks/useFormState'
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChangesGuard'
import useSetState from '../../hooks/useSetState'
import { useCrudContext } from '../../hooks/useCrudContext'
import { Button } from '../input/button'
import { Confirm } from '../modal'
import { useIntl } from 'react-intl'
import { get } from '../../lib/utils'
import {
  GuillotinaSchema,
  GuillotinaSchemaProperty,
} from '../../types/guillotina'
import {
  IndexSignature,
  EditableFieldValue,
  LightFile,
} from '../../types/global'

// Fields to ignore in the form
const _ignoreFields = [
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
]

// Helper to get icon class based on field type/widget
const getFieldIcon = (
  schema: GuillotinaSchemaProperty
): { icon: string; className: string } => {
  const widget = schema.widget
  const type = schema.type

  if (widget === 'file' || widget === 'cloudfile') {
    return { icon: 'fas fa-file-upload', className: 'icon-file' }
  }
  if (widget === 'richtext' || widget === 'textarea') {
    return { icon: 'fas fa-align-left', className: 'icon-text' }
  }
  if (widget === 'select' || widget === 'vocabulary') {
    return { icon: 'fas fa-list-ul', className: 'icon-select' }
  }
  if (widget === 'checkbox' || type === 'boolean') {
    return { icon: 'fas fa-toggle-on', className: 'icon-boolean' }
  }
  if (widget === 'date' || widget === 'datetime' || type === 'datetime') {
    return { icon: 'fas fa-calendar-alt', className: 'icon-date' }
  }
  if (type === 'integer' || type === 'number' || type === 'float') {
    return { icon: 'fas fa-hashtag', className: 'icon-number' }
  }
  if (type === 'array') {
    return { icon: 'fas fa-list', className: 'icon-list' }
  }
  if (type === 'object') {
    return { icon: 'fas fa-code', className: 'icon-object' }
  }
  // Default text
  return { icon: 'fas fa-font', className: 'icon-text' }
}

const isWideField = (schema: GuillotinaSchemaProperty) => {
  return (
    schema.type === 'object' ||
    schema.type === 'array' ||
    schema.widget === 'textarea' ||
    schema.widget === 'richtext' ||
    schema.widget === 'file' ||
    schema.widget === 'cloudfile' ||
    schema.widget === 'search_list'
  )
}

const EMPTY_ARRAY: string[] = []

const getFormValue = (
  context: IndexSignature,
  key: string,
  fieldSchema: GuillotinaSchemaProperty
) => {
  const value = get(context, key, '')
  if (fieldSchema.type === 'array' && (value == null || value === '')) {
    return EMPTY_ARRAY
  }
  return value
}

interface SchemaState {
  data?: GuillotinaSchema
  loading: boolean
  error: string | unknown
}

interface PanelEditFormProps {
  /**
   * Callback to notify parent of dirty state changes.
   * Used to integrate with tab navigation guards.
   */
  onDirtyChange?: (isDirty: boolean) => void
}

export function PanelEditForm({ onDirtyChange }: PanelEditFormProps) {
  const intl = useIntl()
  const Ctx = useTraversal()
  const cfg = useConfig()
  const { patch, loading: patchLoading } = useCrudContext()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')

  const EditComponent = Ctx.registry.getComponent('EditComponent')

  const [schema, setSchema] = useSetState<SchemaState>({
    data: undefined,
    loading: false,
    error: undefined,
  })

  const ignoreFields =
    Ctx.registry.getProperties(Ctx.context['@type']).ignoreField ||
    cfg.properties_ignore_fields ||
    _ignoreFields

  // Get editable properties from schema
  const editableProperties = useMemo(() => {
    if (!schema.data?.properties) return []

    return Object.keys(schema.data.properties)
      .filter((key) => !ignoreFields.includes(key))
      .filter((key) => {
        // Filter out $ref arrays (behavior references)
        const prop = schema.data!.properties[key]
        return !Array.isArray(prop)
      })
      .map((key) => ({
        key,
        schema: schema.data!.properties[key] as GuillotinaSchemaProperty,
      }))
  }, [schema.data, ignoreFields])

  // Build initial values from context
  const initialValues = useMemo(() => {
    const values: IndexSignature = {}
    editableProperties.forEach(({ key, schema: fieldSchema }) => {
      values[key] = getFormValue(Ctx.context, key, fieldSchema)
    })
    return values
  }, [editableProperties, Ctx.context])

  const {
    formData,
    setFieldValue,
    isDirty,
    isFieldDirty,
    getChangedFields,
    resetForm,
    resetFormWithValues,
    changedFieldsCount,
  } = useFormState({
    initialValues,
  })

  // Update form when context changes (e.g., after save)
  useEffect(() => {
    if (schema.data && editableProperties.length > 0) {
      const newValues: IndexSignature = {}
      editableProperties.forEach(({ key, schema: fieldSchema }) => {
        newValues[key] = getFormValue(Ctx.context, key, fieldSchema)
      })
      resetFormWithValues(newValues)
    }
  }, [Ctx.context, schema.data])

  // Notify parent of dirty state changes
  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty)
    }
  }, [isDirty, onDirtyChange])

  const { showConfirmModal, confirmLeave, cancelLeave } =
    useUnsavedChangesGuard({
      isDirty,
      message: intl.formatMessage({
        id: 'unsaved_changes_warning',
        defaultMessage:
          'You have unsaved changes. Are you sure you want to leave?',
      }),
    })

  // Load schema
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
  }, [schema, Ctx.client, Ctx.path, Ctx.context.type_name, setSchema])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!isDirty) return

      const changedFields = getChangedFields()
      const changedKeys = Object.keys(changedFields)

      // Separate file fields from regular fields
      const fileFields: { key: string; value: LightFile }[] = []
      const regularFields: IndexSignature = {}

      changedKeys.forEach((key) => {
        const prop = editableProperties.find((p) => p.key === key)
        const fieldSchema = prop?.schema

        if (fieldSchema?.widget === 'file') {
          const fileValue = changedFields[key] as LightFile
          if (fileValue) {
            fileFields.push({ key, value: fileValue })
          }
        } else {
          regularFields[key] = changedFields[key]
        }
      })

      let hasError = false
      let successCount = 0

      // Upload file fields individually via @upload endpoint
      for (const { key, value } of fileFields) {
        try {
          // Encode filename as done in editableField.tsx
          const fileValue = { ...value }
          if (fileValue.filename) {
            fileValue.filename = unescape(
              encodeURIComponent(fileValue.filename)
            )
          }

          const endpoint = `${Ctx.path}@upload/${key}`
          const req = await Ctx.client.upload(endpoint, fileValue)

          if (req.status !== 200) {
            hasError = true
            Ctx.flash(
              intl.formatMessage(
                {
                  id: 'file_upload_error',
                  defaultMessage: 'Error uploading file for field {field}',
                },
                { field: key }
              ),
              'danger'
            )
          } else {
            successCount++
          }
        } catch {
          hasError = true
          Ctx.flash(
            intl.formatMessage(
              {
                id: 'file_upload_error',
                defaultMessage: 'Error uploading file for field {field}',
              },
              { field: key }
            ),
            'danger'
          )
        }
      }

      // PATCH regular fields if any
      if (Object.keys(regularFields).length > 0) {
        const result = await patch(regularFields)
        if (result.isError) {
          hasError = true
          Ctx.flash(
            intl.formatMessage({
              id: 'edit_form_error',
              defaultMessage: 'Error saving changes',
            }),
            'danger'
          )
        } else {
          successCount += Object.keys(regularFields).length
        }
      }

      // Show success message if any field was saved
      if (successCount > 0 && !hasError) {
        Ctx.flash(
          intl.formatMessage(
            {
              id: 'edit_form_success',
              defaultMessage: '{count} field(s) updated successfully',
            },
            { count: successCount }
          ),
          'success'
        )
      } else if (successCount > 0 && hasError) {
        Ctx.flash(
          intl.formatMessage(
            {
              id: 'edit_form_partial_success',
              defaultMessage:
                '{count} field(s) updated, but some errors occurred',
            },
            { count: successCount }
          ),
          'warning'
        )
      }

      Ctx.refresh()
    },
    [isDirty, getChangedFields, editableProperties, patch, Ctx, intl]
  )

  const handleReset = useCallback(() => {
    resetForm()
  }, [resetForm])

  if (!modifyContent) {
    return (
      <div className="notification is-warning">
        {intl.formatMessage({
          id: 'no_modify_permission',
          defaultMessage: 'You do not have permission to modify this content.',
        })}
      </div>
    )
  }

  if (schema.loading) {
    return (
      <div className="container">
        <progress className="progress is-small is-primary" max="100">
          Loading...
        </progress>
      </div>
    )
  }

  if (schema.error) {
    return (
      <div className="notification is-danger">
        {intl.formatMessage({
          id: 'schema_load_error',
          defaultMessage: 'Error loading schema',
        })}
      </div>
    )
  }

  const editTitle =
    Ctx.context.title ||
    intl.formatMessage({
      id: 'edit_form_title',
      defaultMessage: 'Edit Properties',
    })

  return (
    <div className="container edit-form">
      <form onSubmit={handleSubmit}>
        <div className="edit-form-header">
          <div className="edit-form-title">
            <div>
              <h3 className="title is-5 mb-1">{editTitle}</h3>
              <p className="edit-form-summary">
                {intl.formatMessage(
                  {
                    id: 'editable_fields_count',
                    defaultMessage: '{count} editable field(s)',
                  },
                  { count: editableProperties.length }
                )}
              </p>
            </div>
            {isDirty && (
              <span className="tag is-warning">
                <span className="icon is-small mr-1">
                  <i className="fas fa-pen"></i>
                </span>
                {intl.formatMessage(
                  {
                    id: 'fields_modified',
                    defaultMessage: '{count} field(s) modified',
                  },
                  { count: changedFieldsCount }
                )}
              </span>
            )}
          </div>
          <div className="edit-form-actions">
            <button
              type="button"
              className="button is-light"
              onClick={handleReset}
              disabled={!isDirty || patchLoading}
            >
              <span className="icon is-small">
                <i className="fas fa-undo"></i>
              </span>
              <span>
                {intl.formatMessage({
                  id: 'discard_changes',
                  defaultMessage: 'Discard Changes',
                })}
              </span>
            </button>
            <Button
              type="submit"
              className="is-primary"
              loading={patchLoading}
              disabled={!isDirty}
              dataTest="btnSaveAllTest"
            >
              <span className="icon is-small">
                <i className="fas fa-save"></i>
              </span>
              <span>
                {intl.formatMessage({
                  id: 'save_all_changes',
                  defaultMessage: 'Save All Changes',
                })}
              </span>
            </Button>
          </div>
        </div>

        {editableProperties.length > 0 ? (
          <div className="edit-form-grid">
            {editableProperties.map(({ key, schema: fieldSchema }) => {
              const isReadonly = fieldSchema.readonly === true
              const isRequired = (schema.data?.required ?? []).includes(key)
              const isModified = isFieldDirty(key)
              const fieldIcon = getFieldIcon(fieldSchema)

              const rowClasses = [
                'edit-form-field-row',
                isModified ? 'is-modified' : '',
                isReadonly ? 'is-readonly' : '',
                isWideField(fieldSchema) ? 'is-wide' : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <div key={key} className={rowClasses}>
                  <div className="field-header">
                    <div className="field-heading">
                      <div className={`field-icon ${fieldIcon.className}`}>
                        <i className={fieldIcon.icon}></i>
                      </div>
                      <div className="field-title">
                        <label className="label" htmlFor={`field-${key}`}>
                          {fieldSchema.title || key}
                          {isRequired && (
                            <span className="has-text-danger ml-1">*</span>
                          )}
                          {isReadonly && (
                            <span className="tag is-light is-small ml-2">
                              <span className="icon is-small">
                                <i className="fas fa-lock"></i>
                              </span>
                            </span>
                          )}
                        </label>
                        <span className="field-key">{key}</span>
                      </div>
                    </div>
                    {fieldSchema.description && (
                      <p className="field-description">
                        {fieldSchema.description}
                      </p>
                    )}
                  </div>
                  <div className="field-control">
                    <EditComponent
                      id={`field-${key}`}
                      schema={fieldSchema}
                      val={formData[key] as EditableFieldValue}
                      setValue={(value: EditableFieldValue) =>
                        setFieldValue(key, value)
                      }
                      dataTest={`editForm-${key}`}
                      required={isRequired}
                      disabled={isReadonly}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="notification is-info is-light">
            {intl.formatMessage({
              id: 'no_editable_properties',
              defaultMessage:
                'No editable properties found for this content type.',
            })}
          </div>
        )}
      </form>

      {/* Unsaved changes confirmation modal */}
      {showConfirmModal && (
        <Confirm
          message={intl.formatMessage({
            id: 'unsaved_changes_confirm',
            defaultMessage:
              'You have unsaved changes. Do you want to discard them?',
          })}
          onCancel={cancelLeave}
          onConfirm={confirmLeave}
        />
      )}
    </div>
  )
}

export default PanelEditForm
