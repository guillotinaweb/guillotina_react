import React from "react";
import {lightFileReader} from '../../lib/client'


export function FileUpload({label, onChange}) {

  const changed = async (event) => {
    const file = await lightFileReader(event.target.files[0])
    onChange(file)
  }

  return (
    <div className="file">
      <label className="file-label">
        <input className="file-input"
          type="file"
          name="file"
          onChange={changed}
          />
        <span className="file-cta">
          <span className="file-icon">
            <i className="fas fa-upload"></i>
          </span>
          <span className="file-label">{label || 'Choose a file…'}</span>
        </span>
      </label>
    </div>
  );
}
