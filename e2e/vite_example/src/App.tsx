/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ClientProvider,
  Guillotina,
  Layout,
  Auth,
  getClient,
  Login,
  RequiredFieldsForm,
  Icon,
  TdLink,
} from 'react-gmi'
import { Fragment, useState, useEffect } from 'react'
import '../node_modules/react-gmi/dist/css/style.css'

// guillotina url
const url = 'http://localhost:8080'
const schemas = ['/', '/db/container_test/']
const auth = new Auth(url)
// const client = getClient(url, schema, auth)

const filtersConfig = [
  {
    attribute_key: 'choice_field',
    label: 'Choice field',
    type: 'select',
    values: [
      {
        value: 'date',
        text: 'Date',
      },
      {
        value: 'integer',
        text: 'Integer',
      },
      {
        value: 'text',
        text: 'Text',
      },
      {
        value: 'float',
        text: 'Float',
      },
      {
        value: 'keyword',
        text: 'Keyword',
      },
      {
        value: 'boolean',
        text: 'Boolean',
      },
    ],
  },
  {
    attribute_key: 'choice_field_vocabulary',
    label: 'Choice field vocabulary',
    type: 'select',
    vocabulary: 'gmi_vocabulary',
  },
  {
    attribute_key: 'text_field',
    label: 'Text field',
    type: 'input',
  },
  {
    attribute_key: 'number_field',
    label: 'Number field',
    type: 'input',
    input_type: 'number',
  },
  {
    attribute_key: 'date_field',
    label: 'Date field',
    type: 'input',
    input_type: 'date',
  },
  {
    attribute_key: 'boolean_field',
    label: 'Boolean field',
    type: 'select',
    values: [
      {
        value: 'true',
        text: 'Yes',
      },
      {
        value: 'false',
        text: 'No',
      },
    ],
  },
  {
    attribute_key: 'review_state',
    label: 'Workflow state',
    type: 'select',
    values: [
      {
        value: 'private',
        text: 'Private',
      },
      {
        value: 'public',
        text: 'Public',
      },
    ],
  },
]
function App() {
  const [currentSchema, setCurrentSchema] = useState('/')
  const [clientInstance, setClientInstance] = useState(undefined)
  const [isLogged, setLogged] = useState(auth.isLogged)
  console.log('auth is logged', auth.isLogged)
  useEffect(() => {
    setClientInstance(getClient(url, currentSchema, auth))
  }, [currentSchema])

  const onLogin = () => {
    setLogged(true)
  }

  const onLogout = () => {
    setLogged(false)
  }

  auth.onLogout = onLogout
  if (clientInstance == undefined) {
    return null
  }

  return (
    <ClientProvider client={clientInstance}>
      <Layout auth={auth} onLogout={onLogout}>
        {isLogged && (
          <Guillotina
            auth={auth}
            url={currentSchema}
            registry={{
              schemas: {
                Folder: {
                  filters: filtersConfig,
                },
                Container: {
                  filters: filtersConfig,
                },
              },
              forms: {
                GMI: RequiredFieldsForm,
              },
              itemsColumn: {
                Container: () => {
                  const smallcss = { width: 25 }
                  const mediumcss = { width: 120 }

                  return [
                    {
                      label: '',
                      isSortable: false,
                      child: (m: any) => (
                        <td style={smallcss}>{<Icon icon={m.icon} />}</td>
                      ),
                    },
                    {
                      label: 'type',
                      key: 'type_name',
                      isSortable: false,
                      child: (m: any) => (
                        <TdLink style={smallcss} model={m}>
                          <span className="tag">{m.type}</span>
                        </TdLink>
                      ),
                    },
                    {
                      label: 'id/name',
                      key: 'title',
                      isSortable: true,
                      child: (
                        m: {
                          name: any
                          path: string
                        },
                        _navigate: any,
                        search: any
                      ) => (
                        <TdLink model={m}>
                          {m.name}
                          {search && (
                            <Fragment>
                              <br />
                              <span className="is-size-7 tag is-light">
                                {m.path}
                              </span>
                            </Fragment>
                          )}
                        </TdLink>
                      ),
                    },
                    {
                      label: 'created',
                      key: 'creation_date',
                      isSortable: true,
                      child: (m: { created: string }) => {
                        return (
                          <td
                            style={mediumcss}
                            className="is-size-7 is-vcentered"
                          >
                            {m.created}
                          </td>
                        )
                      },
                    },
                    {
                      label: 'depth',
                      key: 'depth',
                      isSortable: false,
                      child: (m: {
                        item: {
                          depth: number
                        }
                      }) => (
                        <td
                          style={mediumcss}
                          className="is-size-7 is-vcentered"
                        >
                          {m.item.depth}
                        </td>
                      ),
                    },
                    {
                      label: 'modified',
                      key: 'modification_date',
                      isSortable: true,
                      child: (m: { updated: string }) => (
                        <td
                          style={mediumcss}
                          className="is-size-7 is-vcentered"
                        >
                          {m.updated}
                        </td>
                      ),
                    },
                  ]
                },
              },
            }}
          />
        )}
        {!isLogged && (
          <div className="columns is-centered">
            <div className="columns is-half">
              <Login
                onLogin={onLogin}
                auth={auth}
                schemas={schemas}
                currentSchema={currentSchema}
                setCurrentSchema={setCurrentSchema}
              />
            </div>
          </div>
        )}
      </Layout>
    </ClientProvider>
  )
}

export default App
