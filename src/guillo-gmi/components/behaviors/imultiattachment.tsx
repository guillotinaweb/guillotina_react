import { Input } from '../input/input'
import { FileUpload } from '../input/upload'
import { Button } from '../input/button'
import { useState } from 'react'
import { useCrudContext } from '../../hooks/useCrudContext'
import ErrorZone from '../error_zone'
import { EditableField } from '../fields/editableField'
import { Delete } from '../ui'
import { Confirm } from '../modal'
import { Table } from '../ui'
import { useIntl } from 'react-intl'
import {
  genericFileMessages,
  genericMessages,
} from '../../locales/generic_messages'
import { LightFile } from '../../types/global'
import {
  GuillotinaFile,
  GuillotinaSchemaProperties,
  GuillotinaSchemaProperty,
} from '../../types/guillotina'
import { get } from '../../lib/utils'

interface Props {
  properties: GuillotinaSchemaProperties
  values: {
    files: {
      [key: string]: GuillotinaFile
    }
  }
}
export function IMultiAttachment({ properties, values }: Props) {
  const intl = useIntl()
  const [fileKey, setFileKey] = useState('')
  const [file, setFile] = useState<LightFile | undefined>(undefined)
  const [fileKeyToDelete, setFileKeyToDelete] = useState<string | undefined>(
    undefined
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const { Ctx } = useCrudContext()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')

  const uploadFile = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    if (!fileKey && !file) {
      setError(intl.formatMessage(genericFileMessages.error_file_key_name))
      return
    }
    setLoading(true)
    setError(undefined)
    if (!file) {
      return
    }
    const endpoint = `${Ctx.path}@upload/files/${fileKey}`
    const req = await Ctx.client.upload(endpoint, file)
    if (req.status !== 200) {
      setError(intl.formatMessage(genericFileMessages.error_upload_file))
      setLoading(false)
      return
    }
    setFileKey('')
    setFile(undefined)
    setLoading(false)
    Ctx.flash(intl.formatMessage(genericFileMessages.file_uploaded), 'success')
    Ctx.refresh()
  }

  const deleteFile = async () => {
    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@delete/files/${fileKeyToDelete}`
    const req = await Ctx.client.delete(endpoint, file)
    if (req.status !== 200) {
      setError(intl.formatMessage(genericFileMessages.failed_delete_file))
      setLoading(false)
      return
    }
    setLoading(false)
    setError(intl.formatMessage(genericFileMessages.failed_delete_file))
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

      {Object.keys(values['files']).map((key) => (
        <tr key={'multiattachment_' + key}>
          <td key={1} style={{ width: '150px' }}>
            {key}
          </td>
          <td key={2}>
            <div className="is-flex is-align-items-center">
              <EditableField
                field={`files/${key}`}
                value={values['files'][key]}
                ns="guillotina.behaviors.attachment.IMultiAttachment.files"
                schema={
                  get(
                    properties,
                    'files.additionalProperties',
                    {}
                  ) as GuillotinaSchemaProperty
                }
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
          <td colSpan={2}>
            {intl.formatMessage(genericFileMessages.no_files_uploaded)}
          </td>
        </tr>
      )}
      {modifyContent && (
        <tr>
          <td colSpan={2}>
            <label className="label">
              {intl.formatMessage(genericFileMessages.upload_a_file)}
            </label>
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
