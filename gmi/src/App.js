import React, { useEffect } from 'react'
import { Layout } from './guillo-gmi'
import { Auth } from './guillo-gmi'
import { Guillotina } from './guillo-gmi'
import { Login } from './guillo-gmi'
import { getClient } from './guillo-gmi'
import { ClientProvider } from './guillo-gmi'
import { useLocation } from './guillo-gmi/hooks/useLocation'
import { useState } from 'react'

import './guillo-gmi/scss/styles.sass'

/*

This should be enought to scope guillotina
to a container


Schemas should be passed to the login form


const schemas = [
  "",
  "db/guillotina/",
  "db/crawler/",
]
*/

// In alone service url is www.example-domain.com
// In guillotina url is same as domain
let url = ''

const auth = new Auth(url)

function App() {
  const [currentSchema, setCurrentSchema] = useState('/')
  const [location] = useLocation()
  const [clientInstance, setClientInstance] = useState(undefined)
  const [isLogged, setLogged] = useState(auth.isLogged)

  useEffect(() => {
    setClientInstance(getClient(url, currentSchema, auth))
  }, [currentSchema])

  let schemas = location.get('schemas') || undefined
  if (schemas) {
    schemas = ['/', ...schemas.split(',')]
  }

  const onLogin = () => {
    setLogged(true)
  }
  const onLogout = () => setLogged(false)

  auth.onLogout = onLogout
  if (clientInstance === undefined) {
    return null
  }

  return (
    <ClientProvider client={clientInstance}>
      <Layout auth={auth} onLogout={onLogout}>
        {isLogged && <Guillotina auth={auth} url={currentSchema} />}
        {!isLogged && (
          <div className="columns is-centered">
            <div className="columns is-half">
              <Login
                onLogin={onLogin}
                auth={auth}
                schemas={schemas}
                currentSchema={currentSchema}
                setCurrentSchema={setCurrentSchema}
              />
            </div>
          </div>
        )}
      </Layout>
    </ClientProvider>
  )
}

export default App
