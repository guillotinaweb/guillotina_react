import { useState } from 'react'

import { Button } from '../input/button'
import { Confirm } from '../modal'
import { Delete } from '../ui'
import { FileUpload } from '../input/upload'
import { useCrudContext } from '../../hooks/useCrudContext'
import { EditableField } from '../fields/editableField'
import { useConfig } from '../../hooks/useConfig'
import { Table } from '../ui'
import { Input } from '../input/input'
import { useIntl } from 'react-intl'
import {
  genericFileMessages,
  genericMessages,
} from '../../locales/generic_messages'

const _sizesImages = ['large', 'preview', 'mini', 'thumb']

export function IMultiImageAttachment({ properties, values }) {
  const intl = useIntl()
  const cfg = useConfig()
  const [fileKey, setFileKey] = useState('')
  const [file, setFile] = useState(null)
  const [fileKeyToDelete, setFileKeyToDelete] = useState(undefined)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const { Ctx } = useCrudContext()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')
  const sizesImages = cfg.SizeImages || _sizesImages

  const uploadFile = async (ev) => {
    ev.preventDefault()
    if (!fileKey && !file) {
      setError(intl.formatMessage(genericFileMessages.error_file_key_name))
      return
    }
    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@upload/images/${fileKey}`
    const req = await Ctx.client.upload(endpoint, file)
    if (req.status !== 200) {
      setError(intl.formatMessage(genericFileMessages.error_upload_file))
      setLoading(false)
      return
    }

    for (let i = 0; i < sizesImages.length; i++) {
      const endpointSize = `${Ctx.path}@images/images/${fileKey}/${sizesImages[i]}`
      let hasError = false
      try {
        const req = await Ctx.client.upload(endpointSize, file)
        if (req.status !== 200) hasError = true
      } catch (err) {
        hasError = true
      }

      if (hasError) {
        setError(
          intl.formatMessage(genericFileMessages.error_upload_file_size, {
            size: sizesImages[i],
          })
        )
        setLoading(false)
        return
      }
    }

    setFileKey('')
    setFile(undefined)
    setLoading(false)
    Ctx.flash(intl.formatMessage(genericFileMessages.image_uploaded), 'success')
    Ctx.refresh()
  }

  const deleteFile = async () => {
    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@delete/images/${fileKeyToDelete}`
    const req = await Ctx.client.delete(endpoint, file)
    if (req.status !== 200) {
      setError(intl.formatMessage(genericFileMessages.failed_delete_file))
      setLoading(false)
      return
    }
    setLoading(false)
    Ctx.flash(intl.formatMessage(genericFileMessages.image_deleted), 'success')
    Ctx.refresh()
  }

  return (
    <Table
      headers={[
        intl.formatMessage(genericMessages.property),
        intl.formatMessage(genericMessages.value),
      ]}
      className="is-striped is-fullwidth is-size-7"
    >
      {fileKeyToDelete && (
        <Confirm
          loading={loading}
          onCancel={() => setFileKeyToDelete(undefined)}
          onConfirm={() => deleteFile()}
          message={intl.formatMessage(
            genericFileMessages.confirm_message_delete_file,
            { fileKeyToDelete }
          )}
        />
      )}

      {Object.keys(values['images']).map((key) => (
        <tr key={`multiimageattachment_${key}`}>
          <td key={1} style={{ width: '150px' }}>
            {key}
          </td>
          <td key={2}>
            <div className="is-flex is-align-items-center">
              <EditableField
                field={`images/${key}`}
                value={values['images'][key]}
                ns="guillotina.contrib.image.behaviors.IMultiImageAttachment.images"
                schema={properties['images']['additionalProperties']}
                modifyContent={false}
                required={false}
              />
              <div className="ml-5">
                <Delete
                  onClick={(ev) => {
                    ev.preventDefault()
                    setFileKeyToDelete(key)
                  }}
                />
              </div>
            </div>
          </td>
        </tr>
      ))}
      {Object.keys(values['images']).length === 0 && (
        <tr>
          <td colSpan={2}>
            {intl.formatMessage(genericFileMessages.no_images_uploaded)}
          </td>
        </tr>
      )}
      {modifyContent && (
        <tr>
          <td colSpan={2}>
            <label className="label">
              {' '}
              {intl.formatMessage(genericFileMessages.upload_an_image)}
            </label>
            <form className="columns" data-test="formMultiimageAttachmentTest">
              <div className="column is-4">
                <Input
                  placeholder="Key"
                  name="field"
                  className="is-small"
                  value={fileKey}
                  onChange={(ev) => setFileKey(ev)}
                  required
                />
                {error && <p className="help is-danger">{error}</p>}
              </div>
              <div className="column is-2">
                <FileUpload onChange={(ev) => setFile(ev)} />
                {file && file.filename}
              </div>
              <div className="column is-2">
                <Button
                  className="is-primary is-small"
                  loading={loading}
                  onClick={uploadFile}
                  disabled={!fileKey && !file}
                >
                  {intl.formatMessage(genericMessages.upload)}
                </Button>
              </div>
            </form>
          </td>
        </tr>
      )}
    </Table>
  )
}
