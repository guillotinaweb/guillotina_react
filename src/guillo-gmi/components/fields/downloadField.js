import * as React from 'react'
import { useTraversal } from '../../contexts'

export const DownloadField = ({ value }) => {
  const Ctx = useTraversal()
  const { data, field } = value

  const getField = async (downloadFile) => {
    const endpoint = `${Ctx.path}@download/${field}`
    const res = await Ctx.client.download(endpoint)
    const text = await res.blob()
    const blob = new Blob([text], {
      type: data.content_type,
    })
    const url = window.URL.createObjectURL(blob)

    // Create blob link to download
    const link = document.createElement('a')
    link.href = url
    if (downloadFile) {
      link.setAttribute('download', `${data.filename}`)
    } else {
      link.setAttribute('target', `_blank`)
    }

    document.body.appendChild(link)
    link.click()
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(url)
      link.parentNode?.removeChild(link)
    }, 100)
  }

  return (
    <div className="field">
      <div className="label">{data.filename}</div>
      <div className="columns">
        <div className="column">
          <button
            className="button is-small is-primary level-left"
            onClick={async (event) => {
              event.preventDefault()
              event.stopPropagation()
              getField(false)
            }}
          >
            Open
          </button>
        </div>
        <div className="column">
          <button
            className="button is-small is-primary level-right"
            onClick={async (event) => {
              event.preventDefault()
              event.stopPropagation()
              getField(true)
            }}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
