import { useTraversal } from '../../contexts'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'

interface DownloadFieldProps {
  value: {
    data: {
      filename: string
      content_type: string
    }
    field: string
  }
}
export const DownloadField = ({ value }: DownloadFieldProps) => {
  const intl = useIntl()
  const Ctx = useTraversal()
  const { data, field } = value

  const getField = async (downloadFile: boolean) => {
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
            {intl.formatMessage(genericMessages.open)}
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
            {intl.formatMessage(genericMessages.download)}
          </button>
        </div>
      </div>
    </div>
  )
}
