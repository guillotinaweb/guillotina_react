import React from 'react'
import { Guillotina } from "guillo-gmi";
import { Auth } from 'guillo-gmi'
import {Login} from 'guillo-gmi'

import '../node_modules/guillo-gmi/dist/css/style.css'


const url = 'http://localhost:8080/'
const auth = new Auth(url)

export default function App() {

  const [isLogged, setLogged] = React.useState(auth.isLogged)

  const onLogin = () => {
    setLogged(true)
  }
  const onLogout = () => setLogged(false)

  auth.onLogout = onLogout

  return (
      <>
        { isLogged && <Guillotina auth={auth} url={url} />}
        { !isLogged && (
          <div className="columns is-centered">
            <div className="columns is-half">
              <Login onLogin={onLogin} auth={auth} />
            </div>
          </div>
        )}
      </>
  );
}



