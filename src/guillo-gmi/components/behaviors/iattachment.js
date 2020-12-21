import React from 'react'
import { useTraversal } from '../../contexts'
import { FileUpload } from '../input/upload'
import { Button } from '../input/button'

export function IAttachment(props) {
  const ctx = useTraversal()
  const canModify = ctx.hasPerm('guillotina.ModifyContent')

  const uploadFile = async (file) => {
    const endpoint = `${ctx.path}@upload/file`
    const req = await ctx.client.upload(endpoint, file)
    if (req.status !== 200) {
      ctx.flash('Failed to upload file', 'error')
      return
    }
    ctx.flash('file uploaded', 'success')
    ctx.refresh()
  }

  const downloadFile = (file, content_type) => async (event) => {
    const endpoint = `${ctx.path}@download/file`
    const res = await ctx.client.download(endpoint)
    const text = await res.blob()
    const blob = new Blob([text], {
      type: content_type,
    })
    const url = window.URL.createObjectURL(blob)

    // Create blob link to download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${file.filename}`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  return (
    <tr>
      <td>
        {!props.file && 'undefined'}
        {props.file && (
          <React.Fragment>
            {props.file.filename} / {props.file.content_type} ({props.file.size}
            )<br />
            <Button
              onClick={downloadFile(props.file, props.file.content_type)}
              className="is-small"
            >
              Download
            </Button>
          </React.Fragment>
        )}
      </td>
      <td>{canModify && <FileUpload onChange={uploadFile} />}</td>
    </tr>
  )
}
