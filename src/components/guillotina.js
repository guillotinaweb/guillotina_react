import React from "react";
import { useEffect } from "react";
import { getClient } from "../lib/client";
import { getComponent } from "../lib/registry";
import { getAction } from "../lib/registry";
import { Flash } from "../components/flash";
import { TraversalProvider } from "../contexts";
import { Path } from "../components/path";
import { useSetState } from "react-use";
import { useSearchParam } from "react-use";
import { NotAllowed } from "../components/notallowed";
import { Permissions } from "../models";
import {useConfig} from '../hooks/useConfig'


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
  permissions: undefined,
  allowed: true
};

export function Guillotina({ auth, ...props }) {
  const url = props.url || "http://localhost:8080/";
  // const isContainer = props.isContainer || false

  const Config = useConfig(props.config || {})

  const searchPath = useSearchParam("path");
  if (searchPath && searchPath !== "") {
    initialState.path = searchPath;
  }

  const [state, setState] = useSetState(initialState);
  const client = getClient(url, auth);

  async function fetchContext() {
    const { path, refresh } = state;
    let data = await client.getContext(path);
    if (data.status === 401) {
      setState({ allowed: false });
      return;
    }
    let context = await data.json();
    const pr = await client.canido(path, Permissions)
    const perms = await pr.json()
    setState({ context, refresh, allowed: true, permissions:perms });
  }

  useEffect(() => {
    fetchContext();
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
    setState
  };

  const { action, allowed, permissions } = state;
  const Main = getComponent(state.context);
  const Action = action.action ? getAction(action.action) : null;

  return (
    <>
      {allowed ? (
        <TraversalProvider {...contextData}>
          {permissions && <>
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
            <p>Guillotina {JSON.stringify(state.context)}</p>
          </>}
        </TraversalProvider>
      ) : (
        <NotAllowed />
      )}
    </>
  );
}
