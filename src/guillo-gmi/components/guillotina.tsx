import React from 'react'
import { useReducer } from 'react'
import { useEffect } from 'react'
import { Flash } from './flash'
import { TraversalProvider, useGuillotinaClient } from '../contexts'
import { useConfig } from '../hooks/useConfig'
import { IRegistry, useRegistry } from '../hooks/useRegistry'
import { useLocation } from '../hooks/useLocation'
import {
  GuillotinaGlobalState,
  GuillotinaReducerActionTypes,
  guillotinaReducer,
} from '../reducers/guillotina'
import { initialState } from '../reducers/guillotina'
import { Loading } from './ui/loading'
import { IntlProvider } from 'react-intl'
import langCA from '../locales/compiled/ca.json'
import langES from '../locales/compiled/es.json'
import langEN from '../locales/compiled/en.json'
import { Auth } from '../lib/auth'
import { IndexSignature } from '../types/global'

function loadLocaleData(locale: string) {
  switch (locale) {
    case 'ca':
      return langCA
    case 'es':
      return langES
    default:
      return langEN
  }
}

interface GuillotinaProps {
  auth: Auth
  locale: string
  url: string
  config: IndexSignature
  registry: IRegistry
}
export function Guillotina({ auth, locale, ...props }: GuillotinaProps) {
  const messages = loadLocaleData(locale)
  const url = props.url || 'http://localhost:8080' // without trailing slash
  const config = props.config || {}
  const client = useGuillotinaClient()

  const { Permissions } = useConfig(config)
  const registry = useRegistry(props.registry)
  // Location is cooked routing solution (only uses search params)
  const [location] = useLocation()

  // if there is no path provided just go to root
  const searchPath = location.get('path') || '/'
  if (searchPath && searchPath !== '') {
    initialState.path = searchPath
  }

  const [state, dispatch] = useReducer(guillotinaReducer, initialState)

  const { path, refresh } = state

  useEffect(() => {
    dispatch({
      type: GuillotinaReducerActionTypes.SET_PATH,
      payload: {
        path: searchPath,
      },
    })
  }, [searchPath])

  useEffect(() => {
    const initContext = async () => {
      const data = await client.getContext(path)
      if (data.status === 401) {
        dispatch({
          type: GuillotinaReducerActionTypes.SET_ERROR,
          payload: {
            errorStatus: 'notallowed',
          },
        })
        return
      } else if (data.status === 404) {
        dispatch({
          type: GuillotinaReducerActionTypes.SET_ERROR,
          payload: {
            errorStatus: 'notallowed',
          },
        })
        return
      }
      const context = await data.json()
      const pr = await client.canido(path, Permissions)
      const permissions = await pr.json()
      dispatch({
        type: GuillotinaReducerActionTypes.SET_CONTEXT,
        payload: { context, permissions },
      })
    }
    initContext()
  }, [path, refresh, client])

  const ErrorBoundary: React.ComponentType<{
    children: React.ReactNode
  }> = registry.getView('ErrorBoundary')
  const NotAllowed = registry.getView('NotAllowed')
  const NotFound = registry.getView('NotFound')
  const Path = registry.get('components', 'Path') as React.ComponentType

  const contextData = {
    url,
    client,
    auth,
    state,
    dispatch,
    registry,
    flash: config.flash,
  }

  const { action, errorStatus, permissions } = state
  const Main = registry.getComponent(state.context, path) as React.FC<{
    state: GuillotinaGlobalState
  }>
  const Action = action.action
    ? (registry.getAction(action.action) as React.FC<any>)
    : null

  return (
    <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
      <ErrorBoundary>
        {!errorStatus && (
          <TraversalProvider {...contextData}>
            {permissions && (
              <React.Fragment>
                {action.action && Action !== null && (
                  <Action {...action.params} />
                )}
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <Path />
                    </div>
                  </div>
                </div>
                <Flash />
                {Main !== undefined && (
                  <ErrorBoundary>
                    <div className="box main-panel">
                      {state.loading && <Loading />}
                      {!state.loading && <Main state={state} />}
                    </div>
                  </ErrorBoundary>
                )}
                {/* <p>Guillotina {JSON.stringify(state.context)}</p> */}
              </React.Fragment>
            )}
          </TraversalProvider>
        )}
        {errorStatus === 'notallowed' && <NotAllowed />}
        {errorStatus === 'notfound' && <NotFound />}
      </ErrorBoundary>
    </IntlProvider>
  )
}
