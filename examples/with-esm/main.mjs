import React from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'
import htm from 'https://cdn.skypack.dev/htm'
import {
  Guillotina,
  Auth,
  Login,
  ClientProvider,
  Layout,
  getClient,
} from 'https://cdn.skypack.dev/@guillotinaweb/react-gmi'

const html = htm.bind(React.createElement)
const url = 'http://localhost:8080'
const schema = '/'
const auth = new Auth(url)
const client = getClient(url, schema, auth)

function App() {
  const [isLogged, setLogged] = React.useState(auth.isLogged)
  const onLogin = () => setLogged(true)
  const onLogout = () => setLogged(false)
  auth.onLogout = onLogout

  return html`
    <${ClientProvider} client=${client}>
      <${Layout} auth=${auth} onLogout=${onLogout}>
        ${isLogged && html`<${Guillotina} auth=${auth} url=${schema} />`}
        ${
          !isLogged &&
          html`
            <div className="columns is-centered">
              <div className="columns is-half">
                <${Login}
                  onLogin=${onLogin}
                  auth=${auth}
                  currentSchema=${schema}
                />
              </div>
            </div>
          `
        }
      </${Layout}>
    </${ClientProvider}>
  `
}

ReactDOM.render(html`<${App} />`, document.getElementById('root'))
