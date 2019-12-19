import React from "react";
import { useSetState } from "react-use";
import { Select } from "../input/select";
import { Button } from "../input/button";
import { Input } from "../input/input";
import { useCrudContext } from "../../hooks/useCrudContext";

import AceEditor from "react-ace";
import brace from 'brace';
import "brace/mode/json";

const initial = {
  method: "get",
  endpoint: "",
  data: undefined
};

const methods = [
  { text: "GET", value: "get" },
  { text: "POST", value: "post" },
  { text: "DELETE", value: "delete" },
  { text: "PATCH", value: "patch" }
  // { text: "PUT", value: "put" }
];

export function PanelRequester() {
  const [state, setState] = useSetState(initial);
  const { get, post, del, patch, loading, isError, result } = useCrudContext();

  const doRequest = async () => {
    const { method, endpoint, data } = state;
    if (method === "get") {
      await get(endpoint);
    }
    if (method === "post") {
      await post(data, endpoint);
    }
    if (method === "del") {
      await del(endpoint, data);
    }
    if (method === "patch") {
      await patch(data, endpoint);
    }
  };

  return (
    <div className="container">
      <h2 className="title is-size-5">JSON Context Requester</h2>
      <hr />
      <div className="columns is-size-7">
        <div className="column">
          <div className="field">
            <label className="label">Method</label>
            <Select
              options={methods}
              onChange={ev => setState({ method: ev.target.value })}
            />
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Endpoing</label>
            <Input
              placeholder="Default for context"
              type="text"
              onChange={value => setState({ endpoint: value })}
              className="is-small"
            />
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">&nbsp;</label>
            <Button
              className="is-primary is-small"
              loading={loading}
              onClick={doRequest}
            >
              Send
            </Button>
          </div>
        </div>
        <div className="column"></div>
        <div className="column"></div>
      </div>
      <hr />
      <div className="columns">
        <div className="column">
          <h2 className="title is-size-5">Body</h2>
          <AceEditor
            mode="json"
            onChange={data => setState({ data })}
            name="EDITOR"
            width="100%"
            editorProps={{
              $blockScrolling: Infinity,
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
        <div className="column">
          <h2 className="title is-size-5">Response</h2>
          {result && (
            <AceEditor
              mode="json"
              width="100%"
              name="VIEWER"
              fontFamily="Menlo, Consolas, Ubuntu Mono"
              value={JSON.stringify(result, null, 2)}
              editorProps={{
                $blockScrolling: Infinity,
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,

              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
