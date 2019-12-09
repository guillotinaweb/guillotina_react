
import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import {getClient} from '../lib/client'
import {getComponent} from '../lib/registry'
import {getAction} from '../lib/registry'
import {Notification} from 'bloomer'
import {Delete} from 'bloomer'
import {FlashContext} from '../contexts'
import {TraversalContext} from '../contexts';
import {Path} from '../components/path'
import {useSetState} from '../hooks/setstate'


const initialState = {
  path: '/db/crawler/',
  context: undefined
}

const flashInitial = {
  message: undefined, type:undefined
}

const actionsInitial = {
  action: undefined,
  params: undefined
}

export function Guillotina(props) {

  const url = props.url || 'http://localhost:8080/'
  const [state, setContext] = useState(initialState)
  const [flash, setFlash] = useState(flashInitial)
  const [action, doAction] = useState(actionsInitial)

  const clearFlash = () => {
    setFlash({message: undefined, type:undefined})
  }

  const flashMessage = (message, type) =>
    setFlash({message, type})

  const {auth} = props
  const client = getClient(url, props.auth)

  async function fetchContext() {
    const {path, refresh} = state
    const data = await client.getContext(path)
    const context = await data.json()
    setContext({context, path, refresh})
  }

  const setPath = (path) => {
    console.log("Path", path)
    setContext({
      context:state.context,
      path,
      refresh: Math.random()
    })
  }

  useEffect(() => {
    fetchContext()
  }, [state.path, state.refresh])

  const contextData = {
    setPath,
    client,
    auth,
    path: state.path,
    context: state.context,
    doAction: (action, params) => doAction({action, params}),
    cancelAction: () => doAction({action:undefined, params:undefined}),
    flash: flashMessage,
    refresh: () => setPath(state.path)
  }

  const Main = getComponent(state.context)
  const Action = action.action ? getAction(action.action) : null

  return (
    <TraversalContext.Provider value={contextData}>
      <FlashContext.Provider value={flashMessage}>
        {action.action && <Action {...action.params} />}
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <Path path={state.path} setPath={setPath} />
            </div>
          </div>
        </div>
        {flash.message && (
          <Notification isColor={flash.type}>
            {flash.message}
            <Delete onClick={clearFlash} />
          </Notification>)}
        {Main && <div className="box">
          <Main state={state} setPath={setPath} client={client} />
        </div>}
        <p>Guillotina {JSON.stringify(state.context)}</p>
      </FlashContext.Provider>
    </TraversalContext.Provider>
  )
}
