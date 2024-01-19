import { InputHTMLAttributes } from 'react'
import { lightFileReader } from '../../lib/client'
import { useIntl } from 'react-intl'

interface Props {
  label?: string
  dataTest?: string
}
export function FileUpload({
  label,
  onChange,
  dataTest,
}: Props & InputHTMLAttributes<HTMLInputElement>) {
  const intl = useIntl()
  const changed = async (event) => {
    const file = await lightFileReader(event.target.files[0])
    onChange(file)
  }

  return (
    <div className="file">
      <label className="file-label">
        <input
          className="file-input"
          type="file"
          name="file"
          onChange={changed}
          data-test={dataTest}
        />
        <span className="file-cta">
          <span className="file-icon">
            <i className="fas fa-upload"></i>
          </span>
          <span className="file-label">
            {label ||
              intl.formatMessage({
                id: 'choose_file',
                defaultMessage: 'Choose a file',
              })}
          </span>
        </span>
      </label>
    </div>
  )
}
