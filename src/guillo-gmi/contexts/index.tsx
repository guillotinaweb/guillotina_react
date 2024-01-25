import { Dispatch, useContext } from 'react'
import { createContext } from 'react'
import { GuillotinaClient } from '../lib/client.js'
import { Auth } from '../lib/auth.js'
import { IndexSignature } from '../types/global'
import { GuillotinaGlobalState } from '../reducers/guillotina'

export const AuthContext = createContext({})

export const ClientContext = createContext<GuillotinaClient>(null)

interface PropsTraversal {
  url: string
  client: GuillotinaClient
  auth: Auth
  state: GuillotinaGlobalState
  dispatch: Dispatch<{ type: string; payload: IndexSignature }>
  registry: IndexSignature
  flash: (action: string, result: string) => void
}

class Traversal {
  private dispatch
  private state
  public client
  public registry
  public auth
  private url

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
    this.dispatch({ type: 'REFRESH', payload: { transparent } })
  }

  get path() {
    return this.state.path
  }

  get pathPrefix() {
    return this.state.path.slice(1)
  }

  get context() {
    return this.state.context
  }

  get containerPath() {
    return this.client.getContainerFromPath(this.path)
  }

  apply(data) {
    // apply a optimistic update to context
    this.dispatch({ type: 'APPLY', payload: data })
  }

  flash(message, type) {
    this.dispatch({ type: 'SET_FLASH', payload: { flash: { message, type } } })
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  clearFlash() {
    this.dispatch({ type: 'CLEAR_FLASH' })
  }

  doAction(action, params) {
    this.dispatch({ type: 'SET_ACTION', payload: { action, params } })
  }

  cancelAction() {
    this.dispatch({ type: 'CLEAR_ACTION' })
  }

  hasPerm(permission) {
    return this.state.permissions[permission] === true
  }

  filterTabs(tabs, tabsPermissions) {
    const result = {}
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

export const TraversalContext = createContext<Traversal>(null)
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
  return useContext(TraversalContext)
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
  return useContext(ClientContext)
}
