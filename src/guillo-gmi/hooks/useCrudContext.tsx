import { useTraversal } from '../contexts'
import useSetState from './useSetState'

interface State<T = unknown> {
  loading?: boolean
  isError?: boolean
  errorMessage?: string
  result?: T
  response?: unknown
}
const initial: State = {
  loading: undefined,
  isError: false,
  errorMessage: undefined,
  result: undefined,
  response: undefined,
}

const getErrorMessage = (dataError, defaultValue) => {
  if (dataError && dataError.details) {
    return dataError.details
  } else if (dataError && dataError.reason) {
    return dataError.reason
  }
  return defaultValue
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
      errorMessage: getErrorMessage(await res.json(), res.status),
      response: res,
    }
}

const patch = (setState, Ctx) => async (
  data,
  endpoint = undefined,
  body = false
): Promise<State> => {
  setState({ loading: true })
  let newState: State = {}
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

const del = (setState, Ctx) => async (
  data = {},
  endpoint = undefined,
  body = false
): Promise<State> => {
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

const post = (setState, Ctx) => async (
  data,
  endpoint = undefined,
  body = true
): Promise<State> => {
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

const get = (setState, Ctx) => async (endpoint = undefined): Promise<State> => {
  setState({ loading: true })
  let newState = {}
  try {
    const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path
    const res = await Ctx.client.get(path)
    newState = await processResponse(res, true)
  } catch (e) {
    console.error('Error', e)
    newState = { isError: true, errorMessage: 'unhandled exception' }
  }

  setState(newState)
  return newState
}

export function useCrudContext<T>() {
  const Ctx = useTraversal()
  const [state, setState] = useSetState<State<T>>(initial)

  return {
    ...state,
    Ctx,
    patch: patch(setState, Ctx),
    del: del(setState, Ctx),
    post: post(setState, Ctx),
    get: get(setState, Ctx),
  }
}
