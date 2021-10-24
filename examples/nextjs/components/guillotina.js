import React from 'react'

import {
  Guillotina,
  Auth,
  Login,
  getClient,
  ClientProvider,
  Layout,
} from '@guillotinaweb/react-gmi'

import '../node_modules/@guillotinaweb/react-gmi/dist/css/style.css'

const url = 'http://localhost:8080'
const schema = '/'
const auth = new Auth(url)
const client = getClient(url, schema, auth)

export default function App() {
  const [isLogged, setLogged] = React.useState(auth.isLogged)

  const onLogin = () => {
    setLogged(true)
  }
  const onLogout = () => setLogged(false)

  auth.onLogout = onLogout

  return (
    <ClientProvider client={client}>
      <Layout auth={auth} onLogout={onLogout}>
        {isLogged && <Guillotina auth={auth} url={schema} />}
        {!isLogged && (
          <div className="columns is-centered">
            <div className="columns is-half">
              <Login onLogin={onLogin} auth={auth} currentSchema={schema} />
            </div>
          </div>
        )}
      </Layout>
    </ClientProvider>
  )
}
