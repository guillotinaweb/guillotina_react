import React from "react";
import { TraversalContext } from "../../contexts";
import { FileUpload } from "../input/upload";
import { Button } from "../input/button";
import { base64ToArrayBuffer} from "../../lib/helpers"


export function IAttachment(props) {
  const ctx = React.useContext(TraversalContext);
  const canModify = ctx.hasPerm("guillotina.ModifyContent");

  const uploadFile = async file => {
    const endpoint = `${ctx.path}@upload/file`;
    const req = await ctx.client.upload(endpoint, file);
    // TODO handle errors and notifications
    ctx.refresh();
  };

  const downloadFile = (file, content_type) => async event => {
    const endpoint = `${ctx.path}@download/file`;
    const res = await ctx.client.download(endpoint);
    const text = await res.text();
    const blob = new Blob([base64ToArrayBuffer(text)], {
      type: content_type
    });
    const url = window.URL.createObjectURL(blob);

    // //Create blob link to download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${file.filename}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <tr>
      <td>File</td>
      <td>
        {!props.file && "undefined"}
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
  );
}


