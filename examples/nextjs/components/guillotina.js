import React from 'react'

import {
  Guillotina,
  Auth,
  Login,
  getClient,
  ClientProvider,
  Layout,
} from '@guillotinaweb/react-gmi'

import '@guillotinaweb/react-gmi/css/style.css'

const url = 'http://localhost:8080'
const schema = '/'
const auth = new Auth(url)
const client = getClient(url, schema, auth)

export default function App() {
  const [isLogged, setLogged] = React.useState(auth.isLogged)
  const [currentSchema, setCurrentSchema] = React.useState(schema)

  const onLogin = () => {
    setLogged(true)
  }
  const onLogout = () => setLogged(false)

  auth.onLogout = onLogout

  return (
    <ClientProvider client={client}>
      <Layout auth={auth} onLogout={onLogout}>
        {isLogged && (
          <Guillotina
            auth={auth}
            url={currentSchema}
            locale="en"
            registry={{}}
          />
        )}
        {!isLogged && (
          <div className="columns is-centered">
            <div className="column is-half">
              <Login
                onLogin={onLogin}
                auth={auth}
                currentSchema={currentSchema}
                setCurrentSchema={setCurrentSchema}
                schemas={[schema]}
              />
            </div>
          </div>
        )}
      </Layout>
    </ClientProvider>
  )
}
