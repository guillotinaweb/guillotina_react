import React from "react";
import { useSetState } from "react-use";
import { TraversalContext } from "../contexts";

const initial = {
  loading: undefined,
  isError: false,
  errorMessage: undefined,
  result: undefined
};

const patch = (sate, setState, Ctx) => async (data, endpoint) => {
  setState({ loading: true });
  try {
    const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path;
    const res = await Ctx.client.patch(path, data);
    if (res.status < 400) {
      // PATCH request has no body
      const result = res.status;
      setState({ result, loading: false });
    } else {
      setState({ isError: true, errorMessage: res.status, loading: false });
    }
  } catch (e) {
    console.error("Error", e);
    setState({ isError: true, errorMessage: "unhandled exception" });
  }
};

const del =  (state, setState, Ctx) => async (data, endpoint) => {
  setState({ loading: true });
  try {
    const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path;
    const res = await Ctx.client.delete(path, data);
    if (res.status < 400) {
      // PATCH request has no body
      const result = res.status;
      setState({ result, loading: false });
    } else {
      setState({ isError: true, errorMessage: res.status, loading: false });
    }
  } catch (e) {
    console.error("Error", e);
    setState({ isError: true, errorMessage: "unhandled exception" });
  }
};

const post =  (state, setState, Ctx) => async (data, endpoint, body=true) => {
  setState({ loading: true });
  try {
    const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path;
    const res = await Ctx.client.post(path, data);
    if (res.status < 400) {
      let result
      if (body) {
        result = await res.json();
      } else {
        result = res.status
      }
      setState({ result, loading: false });
    } else {
      setState({ isError: true, errorMessage: res.status, loading: false });
    }
  } catch (e) {
    console.error("Error", e);
    setState({ isError: true, errorMessage: "unhandled exception" });
  }

};

const get =  (state, setState, Ctx) => async (endpoint) => {
  setState({loading:true})
  const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path;
  const req = await Ctx.client.get(path)
  const data = await req.json()
  setState({loading: false, result:data})
  return data
};

export function useCrudContext() {
  const Ctx = React.useContext(TraversalContext);
  const [state, setState] = useSetState(initial);

  return {
    ...state,
    Ctx,
    patch: patch(state, setState, Ctx),
    del: del(state, setState, Ctx),
    post: post(state, setState, Ctx),
    get: get(state, setState, Ctx),
  };
}
