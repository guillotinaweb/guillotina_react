import React, { useState } from 'react'
import { useTraversal } from '../../contexts'
import { EditableField } from '../fields/editableField'
import { Table } from '../ui'
import { useConfig } from '../../hooks/useConfig'
import { Delete } from '../ui'
import { Button } from '../input/button'
import { FileUpload } from '../input/upload'
import { Confirm } from '../../components/modal'

const _sizesImages = ['large', 'preview', 'mini', 'thumb']

export function IImageAttachment({ properties, values }) {
  const cfg = useConfig()
  const Ctx = useTraversal()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')
  const sizesImages = cfg.size_images || _sizesImages
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [showConfirmToDelete, setShowConfirmToDelete] = useState(false)

  const uploadFile = async (ev) => {
    ev.preventDefault()

    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@upload/image`
    const req = await Ctx.client.upload(endpoint, file)
    if (req.status !== 200) {
      setError('Failed to upload file')
      setLoading(false)
      return
    }

    for (let i = 0; i < sizesImages.length; i++) {
      const endpointSize = `${Ctx.path}@images/image/${sizesImages[i]}`
      let hasError = false
      try {
        const req = await Ctx.client.upload(endpointSize, file)
        if (req.status !== 200) hasError = true
      } catch (err) {
        hasError = true
      }

      if (hasError) {
        setError(`Failed to upload file ${endpointSize}`)
        setLoading(false)
        return
      }
    }

    setFile(undefined)
    setLoading(false)
    Ctx.flash(`Image uploaded!`, 'success')
    Ctx.refresh()
  }

  const deleteFile = async () => {
    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@delete/image`
    const req = await Ctx.client.delete(endpoint, file)
    if (req.status !== 200) {
      setError('Failed to delete file')
      setLoading(false)
      return
    }
    setLoading(false)
    Ctx.flash(`Image deleted!`, 'success')
    Ctx.refresh()
  }

  return (
    <Table
      headers={['Field', 'Value']}
      className="is-striped is-fullwidth is-size-7"
    >
      {showConfirmToDelete && (
        <Confirm
          loading={loading}
          onCancel={() => setShowConfirmToDelete(false)}
          onConfirm={() => deleteFile()}
          message={`Are you sure to remove the image?`}
        />
      )}
      {values['image'] && (
        <tr>
          <td key={1}>Image</td>
          <td key={2}>
            <div className="is-flex is-align-items-center">
              <EditableField
                field={'image'}
                value={values['image']}
                ns="guillotina.behaviors.behaviors.IImageAttachment"
                schema={properties['image']}
                modifyContent={false}
              />
              <div className="ml-5">
                <Delete
                  onClick={(ev) => {
                    ev.preventDefault()
                    setShowConfirmToDelete(true)
                  }}
                />
              </div>
            </div>
          </td>
        </tr>
      )}
      {modifyContent && (
        <tr>
          <td colSpan={2}>
            <label className="label">Upload an image</label>
            <form
              className="is-flex is-align-items-center"
              style={{ gap: '15px' }}
              data-test="formImageAttachmentTest"
            >
              <div>
                <FileUpload onChange={(ev) => setFile(ev)} />
                {file && file.filename}
              </div>
              <div>
                <Button
                  className="is-primary is-small"
                  loading={loading}
                  onClick={uploadFile}
                  disabled={!file}
                >
                  Upload
                </Button>
              </div>
            </form>
            {error && <p className="help is-danger">{error}</p>}
          </td>
        </tr>
      )}
    </Table>
  )
}
