import React from 'react'
import { Guillotina } from 'react-gmi'
import { Auth } from 'react-gmi'
import { Login } from 'react-gmi'
import { getClient } from 'react-gmi'
import { ClientProvider, RequiredFieldsForm, Icon, TdLink } from 'react-gmi'

import '../node_modules/react-gmi/dist/css/style.css'

const url = 'http://localhost:8080'
const container = '/'
const auth = new Auth(url)
const client = getClient(url, container, auth)

const registry = {
  // to register views around guillotina objects paths
  paths: {},
  // default views for content types
  views: {},
  // forms for adding content, they are fired
  // throught an action
  forms: {
    GMI: RequiredFieldsForm,
  },
  // when using the default being able to configure properties
  properties: {
    // Producto: ProductProps,
    // Tag: TagProps
  },
  behaviors: {},
  components: {},
  itemsColumn: {
    Container: () => {
      const smallcss = { width: 25 }
      const mediumcss = { width: 120 }

      return [
        {
          label: '',
          child: (m) => <td style={smallcss}>{<Icon icon={m.icon} />}</td>,
        },
        {
          label: 'type',
          child: (m) => (
            <TdLink style={smallcss} model={m}>
              <span className="tag">{m.type}</span>
            </TdLink>
          ),
        },
        {
          label: 'id/name',
          child: (m, navigate, search) => (
            <TdLink model={m}>
              {m.name}
              {search && (
                <React.Fragment>
                  <br />
                  <span className="is-size-7 tag is-light">{m.path}</span>
                </React.Fragment>
              )}
            </TdLink>
          ),
        },
        {
          label: 'created',
          child: (m) => (
            <td style={mediumcss} className="is-size-7 is-vcentered">
              {m.created}
            </td>
          ),
        },
        {
          label: 'depth',
          child: (m) => (
            <td style={mediumcss} className="is-size-7 is-vcentered">
              {m.item.depth}
            </td>
          ),
        },
        {
          label: 'modified',
          child: (m) => (
            <td style={mediumcss} className="is-size-7 is-vcentered">
              {m.updated}
            </td>
          ),
        },
      ]
    },
  },
}

export default function App() {
  const [isLogged, setLogged] = React.useState(auth.isLogged)

  const onLogin = () => {
    setLogged(true)
  }
  const onLogout = () => setLogged(false)

  auth.onLogout = onLogout

  return (
    <ClientProvider client={client}>
      {isLogged && (
        <Guillotina auth={auth} url={container} registry={registry} />
      )}
      {!isLogged && (
        <div className="columns is-centered">
          <div className="columns is-half">
            <Login onLogin={onLogin} auth={auth} currentSchema={container} />
          </div>
        </div>
      )}
    </ClientProvider>
  )
}
