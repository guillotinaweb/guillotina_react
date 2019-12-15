import React from 'react'
import {createContext} from 'react'
import {getContainerFromPath} from '../lib/client'

export const AuthContext = createContext({});

export const TraversalContext = createContext({})


class Traversal {
  constructor(props) {
    Object.assign(this, props)
  }

  setPath(path) {
    this.setState({
      path, refresh: Math.random()
    })
  }

  refresh() {
    this.setPath(this.state.path)
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
    return getContainerFromPath(this.path)
  }

  apply(data) {
    const context = Object.assign({}, this.state.context, data)
    this.setState({context})
  }

  setPermissions(permissions) {
    this.setState({permissions})
  }

  flash(message, type) {
    this.setState({flash:{message, type}})
  }

  clearFlash() {
    this.setState({flash:{message:undefined, type:undefined}})
  }

  doAction(action, params) {
    this.setState({action:{action, params}})
  }

  cancelAction() {
    this.setState({action:{action:undefined, params:undefined}})
  }

  hasPerm(permission) {
    return this.state.permissions[permission] === true
  }

  filterTabs(tabs, tabsPermissions) {
    const result = {}
    Object.keys(tabs).forEach(item => {
      const perm = tabsPermissions[item]
      if(perm && this.hasPerm(perm)) {
        result[item] = tabs[item]
      } else if(!perm) {
        result[item] = tabs[item]
      }
    })
    return result
  }

}


export function TraversalProvider({children, ...props}) {
  return (
    <TraversalContext.Provider value={new Traversal(props)}>
      {children}
    </TraversalContext.Provider>
  )
}
