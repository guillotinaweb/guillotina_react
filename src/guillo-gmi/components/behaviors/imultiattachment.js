import React from 'react'
import { Input } from '../input/input'
import { FileUpload } from '../input/upload'
import { Button } from '../input/button'
import { useState } from 'react'
import { useCrudContext } from '../../hooks/useCrudContext'
import ErrorZone from '../error_zone'
import { EditableField } from '../fields/editableField'
import { Delete } from '../ui'
import { Confirm } from '../../components/modal'

export function IMultiAttachment({ properties, values }) {
  const [fileKey, setFileKey] = useState('')
  const [file, setFile] = useState()
  const [fileKeyToDelete, setFileKeyToDelete] = useState(undefined)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const { Ctx } = useCrudContext()

  const uploadFile = async (ev) => {
    ev.preventDefault()
    if (!fileKey && !file) {
      setError('Provide a file and a key name')
      return
    }
    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@upload/files/${fileKey}`
    const req = await Ctx.client.upload(endpoint, file)
    if (req.status !== 200) {
      setError('Failed to upload file')
      setLoading(false)
      return
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
    const endpoint = `${Ctx.path}@delete/files/${fileKeyToDelete}`
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
    <React.Fragment>
      {fileKeyToDelete && (
        <Confirm
          loading={loading}
          onCancel={() => setFileKeyToDelete(undefined)}
          onConfirm={() => deleteFile(fileKeyToDelete)}
          message={`Are you sure to remove: ${fileKeyToDelete}?`}
        />
      )}

      {Object.keys(values['files']).map((key) => (
        <tr key={'multiattachment_' + key}>
          <td key={1}>{key}</td>
          <td key={2}>
            <div className="is-flex is-align-items-center">
              <EditableField
                field={key}
                value={values['files'][key]}
                ns="guillotina.behaviors.attachment.IMultiAttachment.files"
                schema={properties['files']['additionalProperties']}
                modifyContent={false}
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
      {Object.keys(values['files']).length === 0 && (
        <tr>
          <td colSpan={2}>No files uploaded</td>
        </tr>
      )}
      <tr>
        <td colSpan={2}>
          <label className="label">Upload a file</label>
          <form className="columns">
            <div className="column is-4">
              <Input
                placeholder="Key"
                name="field"
                className="is-small"
                value={fileKey}
                onChange={(ev) => setFileKey(ev)}
              />
              {error && <ErrorZone>{error}</ErrorZone>}
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
    </React.Fragment>
  )
}
