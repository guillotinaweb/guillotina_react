import { Traversal, useTraversal } from '../contexts'
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

interface DataError {
  details: string
  reason: string
}
const getErrorMessage = (
  dataError: DataError,
  defaultValue: string | number
) => {
  if (dataError && dataError.details) {
    return dataError.details
  } else if (dataError && dataError.reason) {
    return dataError.reason
  }
  return defaultValue
}

async function processResponse<T>(
  res: Response,
  ready_body = true
): Promise<State<T>> {
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
      errorMessage: getErrorMessage(await res.json(), res.status).toString(),
      response: res,
    }
}

function patch<T>(
  setState: (value: Partial<State<T>>) => void,
  Ctx: Traversal
) {
  return async (
    data = {},
    endpoint?: string,
    body = false
  ): Promise<State<T>> => {
    setState({ loading: true })
    let newState = {}
    try {
      const path = endpoint ? `${Ctx.path}${endpoint}` : Ctx.path
      const res = await Ctx.client.patch(path, data)
      newState = await processResponse<T>(res, body)
    } catch (e) {
      console.error('Error', e)
      newState = { isError: true, errorMessage: 'unhandled exception' }
    }
    setState(newState)
    return newState
  }
}

function del<T>(setState: (value: Partial<State<T>>) => void, Ctx: Traversal) {
  return async (data = {}, endpoint?: string, body = false): Promise<State> => {
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
}

function post<T>(setState: (value: Partial<State<T>>) => void, Ctx: Traversal) {
  return async (data = {}, endpoint?: string, body = true): Promise<State> => {
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
}

function get<T>(setState: (value: Partial<State<T>>) => void, Ctx: Traversal) {
  return async (endpoint?: string): Promise<State> => {
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
}
// const get = (
//   setState: (value: Partial<State>) => void,
//   Ctx: Traversal
// ) =>

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
