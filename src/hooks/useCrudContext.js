import React from "react";
import { useSetState } from "react-use";
import { TraversalContext } from "../contexts";

const initial = {
  loading: false,
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
      return;
    }
    setState({ isError: true, errorMessage: res.status, loading: false });
  } catch (e) {
    console.error("Error", e);
    setState({ isError: true, errorMessage: "unhandled exception" });
  }
};

const del = async (state, setState, Ctx) => endpoint => {};

const post = async (state, setState, Ctx) => (data, endpoint) => {};

const get = async (state, setState, Ctx) => (data, endpoint) => {};

export function useCrudContext() {
  const Ctx = React.useContext(TraversalContext);
  const [state, setState] = useSetState(initial);

  return {
    ...state,
    Ctx,
    patch: patch(state, setState, Ctx),
    del: del(state, setState, Ctx),
    post: post(state, setState, Ctx)
  };
}
