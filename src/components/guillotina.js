
import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import {getClient} from '../lib/client'
import {getComponent} from '../lib/registry'
import {Notification} from 'bloomer'
import {Delete} from 'bloomer'
import {FlashContext} from '../contexts'
import {Path} from '../components/path'


const initialState = {
  path: '/db/crawler/',
  context: undefined
}

const flashInitial = {
  message: undefined, type:undefined
}

export function Guillotina(props) {

  const url = props.url || 'http://localhost:8080/'
  const [state, setContext] = useState(initialState)
  const [flash, setFlash] = useState(flashInitial)

  const clearFlash = () => {
    setFlash({message: undefined, type:undefined})
  }

  const flashMessage = (message, type) =>
    setFlash({message, type})

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
    console.log("use effect")
    fetchContext()
  }, [state.path, state.refresh])

  const Main = getComponent(state.context)

  return (
    <FlashContext.Provider value={flashMessage}>
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
      <p>Love me! Guillotina {JSON.stringify(state.context)}</p>
    </FlashContext.Provider>
  )
}
