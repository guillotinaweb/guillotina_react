import React from 'react'
import {createContext} from 'react'

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

}


export function TraversalProvider({children, ...props}) {
  return (
    <TraversalContext.Provider value={new Traversal(props)}>
      {children}
    </TraversalContext.Provider>
  )
}
