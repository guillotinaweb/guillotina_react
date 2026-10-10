import { ChangeEvent } from 'react'
import { lightFileReader } from '../../lib/client.js'
import { useIntl } from 'react-intl'
import { LightFile } from '../../types/global'

interface Props {
  label?: string
  dataTest?: string
  onChange: (file: LightFile) => void
  disabled?: boolean
}
export function FileUpload({ label, onChange, dataTest, disabled }: Props) {
  const intl = useIntl()
  const changed = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileToUpload = await lightFileReader(event.target.files[0])
      onChange(fileToUpload)
    }
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
          disabled={disabled}
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
