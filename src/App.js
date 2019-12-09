import React from 'react';
import {Layout} from './components/layout'
import {Auth} from './lib/auth'
import {Guillotina} from './components/guillotina'
import {Login} from './components/login'
import {useState} from 'react'
import './scss/styles.sass'

function App() {

  const url = 'http://localhost:8080/'
  const auth = new Auth(url)

  const [isLogged, setLogged] = useState(auth.isLogged)


  const onLogin = () => {
    setLogged(true)
  }
  const onLogout = () => setLogged(false)

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
