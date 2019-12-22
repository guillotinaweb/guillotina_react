import React from "react";


export function FileUpload({label, onChange}) {
  return (
    <div className="file">
      <label className="file-label">
        <input className="file-input"
          type="file"
          name="file"
          onChange={onChange}
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
