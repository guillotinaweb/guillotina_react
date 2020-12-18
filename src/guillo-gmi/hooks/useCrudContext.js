import React from 'react'
import { TraversalContext } from '../contexts'
import useSetState from './useSetState'

const initial = {
  loading: undefined,
  isError: false,
  errorMessage: undefined,
  result: undefined,
  response: undefined,
}

const processResponse = async (res, ready_body = true) => {
  if (res.status < 400)
    return {
      isError: false,
      loading: false,
      result: ready_body ? await res.json() : res.status,
      response: res,
    }
  else
    return {
      isError: true,
      loading: false,
      errorMessage: res.status,
      response: res,
    }
}

const patch = (state, setState, Ctx) => async (
  data,
  endpoint,
  body = false
) => {
  setState({ loading: true })
  let newState = {}
  try {
    const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path
    const res = await Ctx.client.patch(path, data)
    newState = await processResponse(res, body)
  } catch (e) {
    console.error('Error', e)
    newState = { isError: true, errorMessage: 'unhandled exception' }
  }
  setState(newState)
  return newState
}

const del = (state, setState, Ctx) => async (data, endpoint, body = false) => {
  setState({ loading: true })
  let newState = {}
  try {
    const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path
    const res = await Ctx.client.delete(path, data)
    newState = await processResponse(res, body)
  } catch (e) {
    console.error('Error', e)
    newState = { isError: true, errorMessage: 'unhandled exception' }
  }
  setState(newState)
  return newState
}

const post = (state, setState, Ctx) => async (data, endpoint, body = true) => {
  setState({ loading: true })
  let newState = {}
  try {
    const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path
    const res = await Ctx.client.post(path, data)
    newState = await processResponse(res, body)
  } catch (e) {
    console.error('Error', e)
    newState = { isError: true, errorMessage: 'unhandled exception' }
  }
  setState(newState)
  return newState
}

const get = (state, setState, Ctx) => async (endpoint) => {
  setState({ loading: true })
  const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path
  const req = await Ctx.client.get(path)
  const data = await req.json()
  setState({ loading: false, result: data, response: req })
  return data
}

export function useCrudContext() {
  const Ctx = React.useContext(TraversalContext)
  const [state, setState] = useSetState(initial)

  return {
    ...state,
    Ctx,
    patch: patch(state, setState, Ctx),
    del: del(state, setState, Ctx),
    post: post(state, setState, Ctx),
    get: get(state, setState, Ctx),
  }
}
