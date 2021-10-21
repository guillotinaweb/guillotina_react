

## 2. Create GMI application with create react app

Create folder at the same level than guillotina app

```bash
cd tutorial-gmi
npx create-react-app gmi_demo
cd gmi_demo

yarn add -s @guillotinaweb/react-gmi

```

### Modify App.js


```jsx
import React from 'react'
import { Layout } from '@guillotinaweb/react-gmi'
import { Auth } from '@guillotinaweb/react-gmi'
import { Guillotina } from '@guillotinaweb/react-gmi'
import { Login } from '@guillotinaweb/react-gmi'
import { getClient } from '@guillotinaweb/react-gmi'
import { ClientProvider } from '@guillotinaweb/react-gmi'
import { useState } from 'react'
import '@guillotinaweb/react-gmi/dist/css/style.css'

// guillotina url
let url = 'http://localhost:8080'
const schema = '/'
const auth = new Auth(url)
const client = getClient(url, schema, auth)

function App() {
  const [isLogged, setLogged] = useState(auth.isLogged)

  const onLogin = () => {
    setLogged(true)
  }
  const onLogout = () => setLogged(false)

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

Client provider allows us to get guillotina client by `useGuillotinaClient` hook in whereever we want.

`Guillotina` component is the main component, it is de base context that uses, on traversal, and it exposes an API for managening and sharing actions on screens.

### To add icons:

Add the icons to the default public/index.html header

```diff
<meta name="viewport" content="width=device-width, initial-scale=1" />
+ <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
<meta
      name="description"
      content="Web site created using create-react-app"
    />
```

- Copy guillotina logo to your public

```bash
curl https://raw.githubusercontent.com/guillotinaweb/guillotina_react/master/public/logo.svg > public/logo.svg

```

### Start server

```
npm run start
```


[Previous step](step-1-install-guillotina.md) 

[Next step](step-3-firsts-steps-gmi.md)
