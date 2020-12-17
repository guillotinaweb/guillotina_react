import React from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'
import htm from 'https://cdn.skypack.dev/htm'
import { Guillotina, Auth } from 'https://cdn.skypack.dev/@guillotinaweb/react-gmi'

const html = htm.bind(React.createElement);
const url = 'http://localhost:8080/'
const auth = new Auth(url)

function App() {
  const [isLogged, setLogged] = React.useState(auth.isLogged)
  const onLogin = () => setLogged(true)
  const onLogout = () => setLogged(false)
  auth.onLogout = onLogout

  return html`
    ${isLogged && html`<${Guillotina} auth=${auth} url=${url} />`}
    ${!isLogged && html`
      <div className="columns is-centered">
        <div className="columns is-half">
          <${Login} onLogin=${onLogin} auth=${auth} />
        </div>
      </div>
    `}
  `
}

ReactDOM.render(
  html`<${App} />`,
  document.getElementById('root')
);
