import React from 'react'
import { Guillotina } from "@guillotinaweb/react-gmi";
import { Auth } from '@guillotinaweb/react-gmi'
import {Login} from '@guillotinaweb/react-gmi'

import '../node_modules/@guillotinaweb/react-gmi/dist/css/style.css'


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



