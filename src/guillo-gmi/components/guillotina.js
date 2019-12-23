import React from "react";
import { useEffect } from "react";
import { getClient } from "../lib/client";
import { Flash } from "./flash";
import { TraversalProvider } from "../contexts";
import { Path } from "./path";
import { useSetState } from "react-use";
import { NotAllowed } from "./notallowed";
import { NotFound } from "./notfound";
import { Permissions } from "../models";
import { useConfig } from "../hooks/useConfig";
import { useRegistry } from "../hooks/useRegistry";
import { useLocation } from "../hooks/useLocation";

let initialState = {
  path: "",
  context: undefined,
  flash: {
    message: undefined,
    type: undefined
  },
  action: {
    action: undefined,
    params: undefined
  },
  permissions: undefined,
  errorStatus: undefined,
  registry: {},
  refresh: undefined
};

export function Guillotina({ auth, ...props }) {
  const url = props.url || "http://localhost:8080/";

  useConfig(props.config || {});
  const registry = useRegistry();
  const [location, setRouterParam] = useLocation();

  // if there is no path provided just go to root
  const searchPath = location.get("path") || "/";
  if (searchPath && searchPath !== "") {
    initialState.path = searchPath;
  }

  const [state, setState] = useSetState(initialState);
  const client = getClient(url, auth);

  const { path, refresh } = state;

  useEffect(() => {
    setState({ path: searchPath });
  }, [searchPath]);

  useEffect(() => {
    (async () => {
      const { path, refresh } = state;
      console.log("refetching", path, refresh);
      let data = await client.getContext(path);
      if (data.status === 401) {
        setState({ errorStatus: "notallowed" });
        return;
      } else if (data.status === 404) {
        setState({ errorStatus: "notfound" });
        return;
      }
      let context = await data.json();
      const pr = await client.canido(path, Permissions);
      const perms = await pr.json();
      setState({
        context,
        refresh,
        errorStatus: undefined,
        permissions: perms
      });
    })();
  }, [path, refresh]);

  const contextData = {
    url,
    client,
    auth,
    state,
    setState,
    registry,
    setRouterParam
  };

  console.log("repainting", state);

  const { action, errorStatus, permissions } = state;
  const Main = registry.getComponent(state.context);
  const Action = action.action ? registry.getAction(action.action) : null;

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
