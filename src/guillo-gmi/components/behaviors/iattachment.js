import React from "react";
import { TraversalContext } from "../../contexts";
import {FileUpload} from "../input/upload"
import {Button} from "../input/button"
import {readAsDataURL, readAsArrayBuffer} from 'promise-file-reader'


/*

readAsDataURL(file).then(data => {
                  const fields = data.match(/^data:(.*);(.*),(.*)$/);
                  onChange(id, {
                    data: fields[3],
                    encoding: fields[2],
                    'content-type': fields[1],
                    filename: file.name,
                  });


readAsDataURL(file).then(data => {
  const fields = data.match(/^data:(.*);(.*),(.*)$/);
  onChange(id, {
    data: fields[3],
    encoding: fields[2],
    'content-type': fields[1],
    filename: file.name,
  });
});
*/



export function IAttachment(props) {

  const ctx = React.useContext(TraversalContext)
  const canModify = ctx.hasPerm("guillotina.ModifyContent")

  const uploadFile = async (file) => {
    //formData.append('file', files[0])
    const endpoint = `${ctx.path}@upload/file`
    const req = await ctx.client.upload(
      endpoint, file.data, file['content-type'], file.filename
    )
    // TODO handle errors and notifications
    ctx.refresh()
  }

  const downloadFile = (file) => async (event) => {

    const endpoint = `${ctx.path}@download/file`
    const res = await ctx.client.download(endpoint)
    const blob = await res.blob()
    //Create blob link to download
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${file.filename}`);
    // 3. Append to html page
    document.body.appendChild(link);
    // 4. Force download
    link.click();
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link);
  }


  return (
    <tr>
      <td>File</td>
      <td>
        {!props.file && 'undefined'}
        {props.file &&
          <React.Fragment>
            {props.file.filename} / {props.file.content_type} ({props.file.size})<br />
            <Button onClick={downloadFile(props.file)}
              className="is-small">Download</Button>
          </React.Fragment>
        }

      </td>
      <td>
        {canModify && <FileUpload onChange={event=>{
          const file = event.target.files[0];
          readAsDataURL(file).then(data => {
            const fields = data.match(/^data:(.*);(.*),(.*)$/);
            uploadFile({
              data: fields[3],
              encoding: fields[2],
              'content-type': fields[1],
              filename: file.name,
            });
          });
        }} /> }
      </td>
    </tr>
  )
}
