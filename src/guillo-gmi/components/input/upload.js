import React from 'react'
import { lightFileReader } from '../../lib/client'
import { useIntl } from 'react-intl'

export function FileUpload({ label, onChange, ...props }) {
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
          {...props}
          type="file"
          name="file"
          onChange={changed}
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
