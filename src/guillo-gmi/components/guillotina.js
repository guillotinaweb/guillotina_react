import React from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { getClient } from "../lib/client";
import { Flash } from "./flash";
import { TraversalProvider } from "../contexts";
import { useConfig } from "../hooks/useConfig";
import { useRegistry } from "../hooks/useRegistry";
import { useLocation } from "../hooks/useLocation";
import { guillotinaReducer } from "../reducers/guillotina";
import { initialState } from "../reducers/guillotina";
import { Loading } from './ui/loading'

export function Guillotina({ auth, ...props }) {
  const url = props.url || "http://localhost:8080"; // without trailing slash
  const config = props.config || {}

  // Will hold client instance
  const ref = useRef();

  const {Permissions} = useConfig(config);
  const registry = useRegistry(props.registry || {});
  // Location is cooked routing solution (only uses search params)
  const [location, setRouterParam] = useLocation();

  // if there is no path provided just go to root
  const searchPath = location.get("path") || "/";
  if (searchPath && searchPath !== "") {
    initialState.path = searchPath;
  }

  const [state, dispatch] = useReducer(guillotinaReducer, initialState);

  // we store the client on a ref (refs are stable across renders)
  if (!ref.current) {
    // TODO: Refactor, we should be able to provide just a client
    // this way is easy composable and extensible from outside.
    ref.current = props.client || getClient(url, auth);
  }

  const { path, refresh } = state;
  const client = ref.current;

  useEffect(() => {
    dispatch({ type: "SET_PATH", payload: searchPath });
  }, [searchPath]);

  useEffect(() => {
    (async () => {
      let data = await client.getContext(path);
      if (data.status === 401) {
        dispatch({ type: "SET_ERROR", payload: "notallowed" });
        return;
      } else if (data.status === 404) {
        dispatch({ type: "SET_ERROR", payload: "notfound" });
        return;
      }
      let context = await data.json();
      const pr = await client.canido(path, Permissions);
      const permissions = await pr.json();
      dispatch({ type: "SET_CONTEXT", payload: { context, permissions } });

    })();
  }, [path, refresh, client]);

  const ErrorBoundary = registry.get('views', 'ErrorBoundary');
  const NotAllowed = registry.get('views', 'NotAllowed');
  const NotFound = registry.get('views', 'NotFound');
  const Path = registry.get('components', 'Path');

  const contextData = {
    url,
    client,
    auth,
    state,
    dispatch,
    registry,
    setRouterParam,
    flash: config.flash
  };

  const { action, errorStatus, permissions } = state;
  const Main = registry.getComponent(state.context, path);
  const Action = action.action ? registry.getAction(action.action) : null;

  return (
    <ErrorBoundary>
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
                <ErrorBoundary>
                  <div className="box main-panel">
                    {state.loading && <Loading />}
                    {!state.loading && <Main state={state} />}
                  </div>
                </ErrorBoundary>
              )}
              {/* <p>Guillotina {JSON.stringify(state.context)}</p> */}
            </React.Fragment>
          )}
        </TraversalProvider>
      )}
      {errorStatus === "notallowed" && <NotAllowed />}
      {errorStatus === "notfound" && <NotFound />}
    </ErrorBoundary>
  );
}
