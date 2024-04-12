import { Dispatch, useContext, createContext } from 'react'
import { GuillotinaClient } from '../lib/client.js'
import { Auth } from '../lib/auth.js'
import { IndexSignature } from '../types/global'
import {
  GuillotinaGlobalState,
  GuillotinaReducerActionTypes,
} from '../reducers/guillotina'
import { GuillotinaCommonObject } from '../types/guillotina.js'

export const AuthContext = createContext({})

export const ClientContext = createContext<GuillotinaClient | null>(null)

interface PropsTraversal {
  client: GuillotinaClient
  auth: Auth
  state: GuillotinaGlobalState
  dispatch: Dispatch<{
    type: GuillotinaReducerActionTypes
    payload: IndexSignature
  }>
  registry: IndexSignature
  flash: (action: string, result: string) => void
  url: string
  children?: React.ReactNode
}

export class Traversal {
  private dispatch
  public state
  public client
  public registry
  public url
  public auth

  constructor({ flash, ...props }: PropsTraversal) {
    this.dispatch = props.dispatch
    this.state = props.state
    this.client = props.client
    this.registry = props.registry
    this.auth = props.auth
    this.url = props.url
    if (typeof flash === 'function') this.flash = flash
  }

  refresh({ transparent = false } = {}) {
    this.dispatch({
      type: GuillotinaReducerActionTypes.REFRESH,
      payload: { transparent },
    })
  }

  get path() {
    return this.state.path
  }

  get pathPrefix() {
    return this.state.path.slice(1)
  }

  get context(): GuillotinaCommonObject {
    if (this.state.context === undefined) {
      throw new Error('Context is not loaded')
    }
    return this.state.context
  }

  get containerPath() {
    return this.client.getContainerFromPath(this.path)
  }

  apply(data: IndexSignature) {
    // apply a optimistic update to context
    this.dispatch({
      type: GuillotinaReducerActionTypes.APPLY,
      payload: { context: data },
    })
  }

  flash(message: string, type: string) {
    this.dispatch({
      type: GuillotinaReducerActionTypes.SET_FLASH,
      payload: { flash: { message, type } },
    })
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  clearFlash() {
    this.dispatch({
      type: GuillotinaReducerActionTypes.CLEAR_FLASH,
      payload: {},
    })
  }

  doAction(action: string, params = {}) {
    this.dispatch({
      type: GuillotinaReducerActionTypes.SET_ACTION,
      payload: { action, params },
    })
  }

  cancelAction() {
    this.dispatch({
      type: GuillotinaReducerActionTypes.CLEAR_ACTION,
      payload: {},
    })
  }

  hasPerm(permission: string) {
    return this.state.permissions[permission] === true
  }

  filterTabs(tabs: IndexSignature, tabsPermissions: IndexSignature) {
    const result: IndexSignature = {}
    Object.keys(tabs).forEach((item) => {
      const perm = tabsPermissions[item]
      if (perm && this.hasPerm(perm)) {
        result[item] = tabs[item]
      } else if (!perm) {
        result[item] = tabs[item]
      }
    })
    return result
  }
}

export const TraversalContext = createContext<Traversal | null>(null)
export function TraversalProvider({
  children,
  ...props
}: PropsTraversal & { children: React.ReactNode }) {
  return (
    <TraversalContext.Provider value={new Traversal(props)}>
      {children}
    </TraversalContext.Provider>
  )
}

export function useTraversal() {
  const traversal = useContext(TraversalContext)
  if (!traversal) {
    throw new Error('useTraversal must be used within a TraversalProvider')
  }
  return traversal
}

interface PropsClient {
  children: React.ReactNode
  client: GuillotinaClient
}
export function ClientProvider({ children, client }: PropsClient) {
  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  )
}

export function useGuillotinaClient() {
  const client = useContext(ClientContext)
  if (!client) {
    throw new Error('useGuillotinaClient must be used within a ClientProvider')
  }
  return client
}
