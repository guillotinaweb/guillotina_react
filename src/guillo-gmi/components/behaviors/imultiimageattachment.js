import React, { useState } from 'react'

import { Button } from '../input/button'
import { Confirm } from '../../components/modal'
import { Delete } from '../ui'
import { FileUpload } from '../input/upload'
import { useCrudContext } from '../../hooks/useCrudContext'
import { EditableField } from '../fields/editableField'
import { useConfig } from '../../hooks/useConfig'
import { Table } from '../ui'
import { Input } from '../input/input'

const _sizesImages = ['large', 'preview', 'mini', 'thumb']

export function IMultiImageAttachment({ properties, values }) {
  const cfg = useConfig()
  const [fileKey, setFileKey] = useState('')
  const [file, setFile] = useState(null)
  const [fileKeyToDelete, setFileKeyToDelete] = useState(undefined)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const { Ctx } = useCrudContext()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')
  const sizesImages = cfg.size_images || _sizesImages

  const uploadFile = async (ev) => {
    ev.preventDefault()
    if (!fileKey && !file) {
      setError('Provide a file and a key name')
      return
    }
    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@upload/images/${fileKey}`
    const req = await Ctx.client.upload(endpoint, file)
    if (req.status !== 200) {
      setError('Failed to upload file')
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
        setError(`Failed to upload file ${endpointSize}`)
        setLoading(false)
        return
      }
    }

    setFileKey('')
    setFile(undefined)
    setLoading(false)
    Ctx.flash(`${fileKey} uploaded!`, 'success')
    Ctx.refresh()
  }

  const deleteFile = async () => {
    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@delete/images/${fileKeyToDelete}`
    const req = await Ctx.client.delete(endpoint, file)
    if (req.status !== 200) {
      setError('Failed to delete file')
      setLoading(false)
      return
    }
    setLoading(false)
    Ctx.flash(`${fileKeyToDelete} delete!`, 'success')
    Ctx.refresh()
  }

  return (
    <Table
      headers={['Field', 'Value']}
      className="is-striped is-fullwidth is-size-7"
    >
      {fileKeyToDelete && (
        <Confirm
          loading={loading}
          onCancel={() => setFileKeyToDelete(undefined)}
          onConfirm={() => deleteFile()}
          message={`Are you sure to remove: ${fileKeyToDelete}?`}
        />
      )}

      {Object.keys(values['images']).map((key) => (
        <tr key={`multiimageattachment_${key}`}>
          <td key={1}>{key}</td>
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
          <td colSpan={2}>No images uploaded</td>
        </tr>
      )}
      {modifyContent && (
        <tr>
          <td colSpan={2}>
            <label className="label">Upload an image</label>
            <form className="columns">
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
                  Upload
                </Button>
              </div>
            </form>
          </td>
        </tr>
      )}
    </Table>
  )
}
