import React from "react";
import AceEditor from "react-ace";
import brace from "brace";

import useSetState from "../../hooks/useSetState";
import { Button } from "../input/button";
import { Input } from "../input/input";
import { Select } from "../input/select";
import { useCrudContext } from "../../hooks/useCrudContext";

import "brace/mode/json";

const initial = {
  method: "get",
  endpoint: ""
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
  const ref = React.useRef();

  React.useEffect(() => {
    if (ref.current) {
      ref.current = "";
    }
  }, []);

  const doRequest = async (ev) => {

    if (ev) {
      ev.preventDefault()
    }

    const ace =
      ref.current && ref.current !== "" ? JSON.parse(ref.current) : undefined;
    const { method, endpoint } = state;
    if (method === "get") {
      await get(endpoint);
    }
    if (method === "post") {
      await post(ace, endpoint);
    }
    if (method === "del") {
      await del(endpoint, ace);
    }
    if (method === "patch") {
      await patch(ace, endpoint);
    }
  };

  const onUpdate = value => (ref.current = value);

  return (
    <div className="container">
      <h2 className="title is-size-5">JSON Context Requester</h2>
      <hr />
      <form onSubmit={doRequest} className="form">
        <div className="columns is-size-7">
          <div className="column">
            <div className="field">
              <label className="label">Method</label>
              <Select
                options={methods}
                onChange={ev => setState({ method: ev.target.value })}
                style={{ width: "100%" }}
                classWrap="is-block"
              />
            </div>
          </div>
          <div className="column is-4">
            <div className="field">
              <label className="label">Endpoint</label>
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
          <div className="column is-6"></div>
        </div>
      </form>
      <div className="columns">
        <div className="column">
          <h2 className="title is-size-6">Body</h2>
          <AceEditor
            mode="json"
            onChange={onUpdate}
            value={ref.current}
            name="EDITOR"
            width="100%"
            tabSize={2}
            fontFamily="Menlo, Monaco"
            editorProps={{
              $blockScrolling: Infinity,
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true
            }}
          />
        </div>
        <div className="column">
          <h2 className="title is-size-6">Response</h2>
          {result && (
            <AceEditor
              mode="json"
              width="100%"
              name="VIEWER"
              tabSize={2}
              fontFamily="Menlo, Consolas, Ubuntu Mono"
              value={JSON.stringify(result, null, 2)}
              editorProps={{
                $blockScrolling: Infinity,
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
