import React from "react";
import { useEffect } from "react";
import { getClient } from "../lib/client";
import { getComponent } from "../lib/registry";
import { getAction } from "../lib/registry";
import { Flash } from "./flash";
import { TraversalProvider } from "../contexts";
import { Path } from "./path";
import { useSetState } from "react-use";
import { useSearchParam } from "react-use";
import { NotAllowed } from "./notallowed";
import { NotFound } from "./notfound";
import { Permissions } from "../models";
import { useConfig } from "../hooks/useConfig";
import { useRegistry } from "../hooks/useRegistry";

const PAGE_SIZE = 20;

let initialState = {
  path: "",
  context: undefined,
  page: 0,
  flash: {
    message: undefined,
    type: undefined
  },
  action: {
    action: undefined,
    params: undefined
  },
  search: undefined,
  searchParsed: [],
  permissions: undefined,
  errorStatus: undefined,
  registry: {}
};

export function Guillotina({ auth, ...props }) {
  const url = props.url || "http://localhost:8080/";
  // const isContainer = props.isContainer || false

  useConfig(props.config || {});
  const registry = useRegistry();

  const searchPath = useSearchParam("path");
  if (searchPath && searchPath !== "") {
    initialState.path = searchPath;
  }

  const [state, setState] = useSetState(initialState);
  const client = getClient(url, auth);


  useEffect(() => {
    (async () => {
      const { path, refresh } = state;
      let data = await client.getContext(path);
      if (data.status === 401) {
        setState({ errorStatus: 'notallowed' });
        return;
      } else if (data.status === 404) {
        setState({errorStatus: 'notfound'})
        return;
      }
      let context = await data.json();
      const pr = await client.canido(path, Permissions);
      const perms = await pr.json();
      setState({ context, refresh, errorStatus: undefined, permissions: perms });
    })();
  }, [state.path, state.refresh]);

  useEffect(() => {
    window.history.pushState(
      {},
      "",
      window.location.pathname + "?path=" + state.path
    );
  }, [state.path]);

  useEffect(() => {
    window.onpopstate = function(event) {
      if (event.state) {
        setState({ path: searchPath });
      }
    };
  }, []);

  const contextData = {
    url,
    client,
    auth,
    PAGE_SIZE,
    state,
    setState,
    registry
  };

  const { action, errorStatus, permissions } = state;
  const Main = getComponent(state.context);
  const Action = action.action ? getAction(action.action) : null;

  return (
    <React.Fragment>
      {!errorStatus && (
        <TraversalProvider {...contextData}>
          {permissions && (
            <React.Fragment>
              {action.action && <Action {...action.params} />}
              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <Path />
                  </div>
                </div>
              </div>
              <Flash />
              {Main && (
                <div className="box main-panel">
                  <Main state={state} />
                </div>
              )}
              {/* <p>Guillotina {JSON.stringify(state.context)}</p> */}
            </React.Fragment>
          )}
        </TraversalProvider>
      )}
      {errorStatus === "notallowed" && <NotAllowed />}
      {errorStatus === "notfound" && <NotFound />}
    </React.Fragment>
  );
}
