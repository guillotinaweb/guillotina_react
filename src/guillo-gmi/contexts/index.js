import React from "react";
import { createContext } from "react";
import { getContainerFromPath } from "../lib/client";

export const AuthContext = createContext({});

export const TraversalContext = createContext({});

class Traversal {
  constructor({ flash, ...props }) {
    Object.assign(this, props);
    if(typeof flash === 'function') this.flash = flash;
  }

  setPath(path) {
    // This is like black magic, document it
    // router interactions are hard
    this.setRouterParam({ path: path }, true);
  }

  refresh() {
    this.dispatch({ type: "REFRESH" });
  }

  get path() {
    return this.state.path;
  }

  get pathPrefix() {
    return this.state.path.slice(1);
  }

  get context() {
    return this.state.context;
  }

  get containerPath() {
    return getContainerFromPath(this.path);
  }

  apply(data) {
    // apply a optimistic update to context
    this.dispatch({type: "APPLY", payload:data})
  }

  flash(message, type) {
    this.dispatch({ type: "SET_FLASH", payload: { flash: { message, type } } });
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  clearFlash() {
    this.dispatch({ type: "CLEAR_FLASH" });
  }

  doAction(action, params) {
    this.dispatch({ type: "SET_ACTION", payload: { action, params } });
  }

  cancelAction() {
    this.dispatch({ type: "CLEAR_ACTION" });
  }

  hasPerm(permission) {
    return this.state.permissions[permission] === true;
  }

  filterTabs(tabs, tabsPermissions) {
    const result = {};
    Object.keys(tabs).forEach(item => {
      const perm = tabsPermissions[item];
      if (perm && this.hasPerm(perm)) {
        result[item] = tabs[item];
      } else if (!perm) {
        result[item] = tabs[item];
      }
    });
    return result;
  }
}

export function TraversalProvider({ children, ...props }) {
  return (
    <TraversalContext.Provider value={new Traversal(props)}>
      {children}
    </TraversalContext.Provider>
  );
}
