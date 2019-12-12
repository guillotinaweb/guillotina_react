import React from 'react';
import {Layout} from './components/layout'
import {Auth} from './lib/auth'
import {Guillotina} from './components/guillotina'
import {Login} from './components/login'
import {useState} from 'react'
import './scss/styles.sass'

/*

This should be enought to scope guillotina
to a container

const schemas = [
  "db/guillotina/",
  "db/crawler/",
  ""
]

Schemas should be passed to the login form
*/

const url = 'http://localhost:8080/'
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
        { isLogged && <Guillotina auth={auth} url={url} />}
        { !isLogged && (
          <div className="columns is-centered">
            <div className="columns is-half">
              <Login onLogin={onLogin} auth={auth} />
            </div>
          </div>
        )}
      </Layout>
  );
}


export default App;
