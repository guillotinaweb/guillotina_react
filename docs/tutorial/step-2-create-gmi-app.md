

## 2. Create GMI application with Vite and TypeScript

Create folder at the same level as the Guillotina app.

```bash
cd tutorial-gmi
npm create vite@latest gmi_demo -- --template react-ts
cd gmi_demo
pnpm install
pnpm add @guillotinaweb/react-gmi
```

### Modify App.tsx


```tsx
import { useState } from 'react'
import {
  Layout,
  useLocation,
  Auth,
  Guillotina,
  Login,
  getClient,
  ClientProvider,
} from '@guillotinaweb/react-gmi'
import '@guillotinaweb/react-gmi/css/style.css'

// Guillotina server URL
const url = 'http://localhost:8080'
const schema = '/'
const auth = new Auth(url)
const client = getClient(url, schema, auth)

function App() {
  const [, , remove] = useLocation()
  const [isLogged, setLogged] = useState(auth.isLogged)

  const onLogin = () => {
    setLogged(true)
  }

  const onLogout = () => {
    setLogged(false)
    remove('tab')
    remove('path')
  }

  auth.onLogout = onLogout

  return (
    <ClientProvider client={client}>
      <Layout auth={auth} onLogout={onLogout}>
        {isLogged && <Guillotina auth={auth} url={schema} />}
        {!isLogged && (
          <div className="columns is-centered">
            <div className="columns is-half">
              <Login
                onLogin={onLogin}
                auth={auth}
                currentSchema={schema}
              />
            </div>
          </div>
        )}
      </Layout>
    </ClientProvider>
  )
}

export default App
```

The `ClientProvider` allows us to access the Guillotina client using the `useGuillotinaClient` hook wherever we want.

The `Guillotina` component is the main component. It is the base context that uses traversal and exposes an API for managing and sharing actions on screens.

### Adding icons

Add the icons to the default public/index.html header

```diff
<meta name="viewport" content="width=device-width, initial-scale=1" />
+ <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
<meta
      name="description"
      content="Web site created using Vite"
    />
```

- Copy the Guillotina logo to your public folder

```bash
curl https://raw.githubusercontent.com/guillotinaweb/guillotina_react/master/public/logo.svg > public/logo.svg

```

### Start development server

```bash
pnpm dev
```

The application will be available at `http://127.0.0.1:5173`.


[Previous step](step-1-install-guillotina.md) 

[Next step](step-3-firsts-steps-gmi.md)
