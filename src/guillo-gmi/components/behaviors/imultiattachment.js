import React from "react";
import { Input } from "../input/input";
import { FileUpload } from "../input/upload";
import { Button } from "../input/button";
import {useState} from 'react'
import { useCrudContext } from "../../hooks/useCrudContext";
import ErrorZone from '../error_zone'

export function IMultiAttachment(props) {

  const [fileKey, setFileKey] = useState('')
  const [file, setFile] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const {Ctx } = useCrudContext()

  const uploadFile = async (ev) => {
    ev.preventDefault()
    if (!fileKey && !file) {
      setError("Provide a file and a key name")
      return
    }
    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@upload/files/${fileKey}`;
    const req = await Ctx.client.upload(endpoint, file)
    if (req.status !== 200) {
      setError("Failed to upload file")
      return
    }
    setFileKey('')
    setFile(undefined)
    setLoading(false)
    Ctx.flash(`${fileKey} uploaded!`, 'success')
    Ctx.refresh()
  }

  const downloadFile = (file, content_type, fileName) => async event => {
    const endpoint = `${Ctx.path}@download/files/${file}`;
    const res = await Ctx.client.download(endpoint);
    const text = await res.blob();
    const blob = new Blob([text], {
      type: content_type
    });
    const url = window.URL.createObjectURL(blob);

    // Create blob link to download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <React.Fragment>
      {Object.keys(props.files).map(file => (
        <tr key={file}>
          <td>{file}</td>
          <td>
            {props.files[file].filename} / ({props.files[file].content_type})
            &nbsp;
            <Button
              className="is-small"
              onClick={downloadFile(
                file,
                props.files[file].content_type,
                props.files[file].filename
                )}
            >
              Download
            </Button>
          </td>
        </tr>
      ))}
      {Object.keys(props.files).length === 0 && (
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
              <FileUpload
                onChange={(ev) => setFile(ev)}
                />
              {file && file.filename}
            </div>
            <div className="column is-2">
              <Button className="is-primary is-small"
                loading={loading}
                onClick={uploadFile}
                disabled={(!fileKey && !file)}>Upload</Button>
            </div>
          </form>
        </td>
      </tr>
    </React.Fragment>
  );
}
