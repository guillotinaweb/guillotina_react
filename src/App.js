import React from 'react'
import { Layout } from './guillo-gmi'
import { Auth } from './guillo-gmi'
import { Guillotina } from './guillo-gmi'
import { Login } from './guillo-gmi'
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

let url = 'http://localhost:8080/'
if (process.env.NODE_ENV === 'production') {
  url = '/'
}

const auth = new Auth(url)

function App() {
  const [isLogged, setLogged] = useState(auth.isLogged)

  const onLogin = () => {
    setLogged(true)
  }
  const onLogout = () => setLogged(false)

  auth.onLogout = onLogout

  return (
    <Layout auth={auth} onLogout={onLogout}>
      {isLogged && <Guillotina auth={auth} url={url} />}
      {!isLogged && (
        <div className="columns is-centered">
          <div className="columns is-half">
            <Login onLogin={onLogin} auth={auth} />
          </div>
        </div>
      )}
    </Layout>
  )
}

export default App
