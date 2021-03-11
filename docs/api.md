# Guillotina React API

- [Architecture](#architecture)
- [Traversal Context](#traversal-context)
- [Hooks](#hooks)
  - [useLocation](#uselocation)
- [Components](#components)
  - [Guillotina](#guillotina)
  - [TabsPanel](#tabspanel)
  - [ContextToolbar](#contexttoolbar)
  - [PanelPermissions / PanelProperties / PanelItems](#panelpermissions--panelproperties--panelitems)
  - [Icon](#icon)
  - [Modal](#modal)
  - [Form](#form)
    - [Input](#input)
    - [Textarea](#textarea)
    - [Select](#select)
    - [Checkbox](#checkbox)
    - [Button](#button)
    - [FileUpload](#fileupload)
  - [Loading](#loading)
- [Utils](#utils)
  - [RestClient](#restclient)
  - [classnames](#classnames)
  - [stringToSlug](#stringtoslug)
- [Guillotina config](#guillotina-config)

## Architecture

- The main component is guillotina, it's the base context that uses,
  on traversal, and it exposes an API for managening and sharing
  actions on screens. [Read here about traversal context](#traversal-context).

- There is a "component registry" to be able to override components, on
  installations. Actually it's just some maps where you can register,
  component overrides

  - registry/
    Acts as a base context screen registry,
    `getCompoment() and registerComponent() as API exposed

  - actions/

    - Actions are mostly UI interactions you trigger from buttons (remove item)
      and when adding types (Context menu +)
    - They mostly are based on a "modal" that proposes you something
    - Actions can be dispatched, using the main Context

    ```
    Ctx = useTraversal()
    Ctx.doAction("addItem" , "Folder")
    ```

    will show a modal to add an item for a folder

  - forms/
    - Used throught actions to provide forms for <Forms>

views/

- Stores views for contexts

## Traversal Context

@guillotinaweb/react-gmi mostly uses react.Context and hooks to manage state. Through the traversal context we have access to the Guillotina content and to some UI actions / helpers.

```jsx
import { useTraversal } from '@guillotinaweb/react-gmi'
// ...
const Ctx = useTraversal()
// ...
Ctx.doAction // show an action
Ctx.cancelAction // hide (terminate) the latest action. Used, when the process completes
Ctx.flash // Show a flash message on the main screen
Ctx.refresh // Force a refresh from the server for the current traversal context
// Properties
Ctx.path // exposes the current context path (without service url)
Ctx.auth // Exposes the auth service provided throught guillotina main component insta
Ctx.client // Exposes the guillotina client throught the main component
Ctx.context // Current fetched context data for the path
Ctx.filterTabs // Filter the tabs that the current user has permissions
```

## Hooks

### useLocation

Hook to control the routing, know where you are in the content (url) and be able to change the page.

Under the hood it uses [wouter](https://github.com/molefrog/wouter).

```jsx
import { useLocation } from '@guillotinaweb/react-gmi'

// ...
const [location, setLocation] = useLocation()
```

## Components

### Guillotina

```jsx
import { Guillotina } from '@guillotinaweb/react-gmi'
// ...
return (
  <Guillotina
    config={{
      icons: {
        Banners: 'fas fa-image',
        Products: 'fas fa-wine-glass',
        Landings: 'fas fa-receipt',
        Newsletter: 'fas fa-envelope',
      },
      PageSize: 30,
      DelayActions: 2000,
    }}
    url="/db/guillotina/"
    registry={{
      views: {
        ErrorBoundary: ErrorBoundary,
        Banners: BannersView,
        Landings: LandingView,
        Products: ProductView,
        Newsletter: NewsletterView,
      },
      forms: {
        Landings: LandingForm,
        Newsletter: NewsletterForm,
        // others use the default form
      },
      properties: {
        Products: {
          Buttons: null,
        },
      },
    }}
  />
)
```

### TabsPanel

It creates separate tabs, allowing you to add permissions to each tab if used in conjunction with `Ctx.filterTabs`.

```jsx
import { useTraversal, TabsPanel } from '@guillotinaweb/react-gmi'
// ...
const Ctx = useTraversal()

return (
  <TabsPanel
    tabs={Ctx.filterTabs(
      {
        Data: TemplateData,
        Permissions: PanelPermissions,
        AuditLog: AuditLogTab,
      },
      {
        Data: 'guillotina.ViewContent',
        Sections: 'guillotina.ModifyContent',
      }
    )}
    currentTab="Data"
    editableTabs={['Data']}
    rightToolbar={<ContextToolbar {...props} />}
    {...props}
  />
)
```

### ContextToolbar

It is the bar where there is a content search engine along with the buttons with the different actions that the page has.

```jsx
import { ContextToolbar } from '@guillotinaweb/react-gmi'
// ...
return <ContextToolbar {...props} />
```

### PanelPermissions / PanelProperties / PanelItems

To be used in conjunction with the TabsPanel we have two ready-to-use panels already created: Permissions + Properties.

```jsx
import { PanelPermissions } from '@guillotinaweb/react-gmi'
import { PanelProperties } from '@guillotinaweb/react-gmi'
import { PanelItems } from '@guillotinaweb/react-gmi'

// ...
const tabs = {
  Properties: PanelProperties,
  Permissions: PanelPermissions,
  Items: PanelItems,
  // ... rest of custom tabs
}
// ...
return <TabsPanel tabs={tabs} {...props} />
```

### Icon

You can use with this component the icons available in [fontawesome](https://fontawesome.com/).

```jsx
import { Icon } from '@guillotinaweb/react-gmi'
// ...
return <Icon icon="fas fa-angle-left" />
```

### Modal

You can use the Modal component to put content over everything else in the document.

```jsx
import { Modal } from '@guillotinaweb/react-gmi'
// ...
return (
  <Modal className="modal-content" isActive={isActive} setActive={close}>
    {/* Modal content here */}
  </Modal>
)
```

### Link

Designed to navigate to the contents of a Guillotina model:

```js
import { Link } from '@guillotinaweb/react-gmi'
// ...
return <Link model={model}>Go to model path</Link>
```

The navigation is controlled by pushState but it's creating an `<a>` tag underneath allowing to open the link in another tab.

### Form

Wrapper of the html5 form but already designed to integrate with the form components we provide. Apart from that it has some more extra properties and there is no need to do e.preventDefault during the onSubmit.

```jsx
import { Form } from '@guillotinaweb/react-gmi'
// ...
return (
  <Form onSubmit={submit} title="My form" error={errorMsg}>
    {/* all form components here */}
  </Form>
)
```

#### Input

Wrapper of the html5 input-text but already designed to integrate with the rest of the form components.

```jsx
import { Input } from '@guillotinaweb/react-gmi'
// ...
return (
  <Input
    className="is-size-6"
    onChange={(text) => setValue(text)}
    placeholder="Example"
    value={value}
  />
)
```

#### Textarea

Wrapper of the html5 textarea but already designed to integrate with the rest of the form components.

```jsx
import { Textarea } from '@guillotinaweb/react-gmi'
// ...
return <Textarea placeholder="Write here" value={text} onChange={onChange} />
```

#### Select

A custom Select component where you can pass the options as a prop.

```jsx
import { Select } from '@guillotinaweb/react-gmi'
// ...
return (
  <Select
    value={value}
    options={[
      { text: 'First', value: '1' },
      { text: 'Second', value: '2' },
    ]}
    appendDefault
    onChange={(e) => setValue(e.target.value)}
    classWrap="is-small"
  />
)
```

#### Checkbox

Wrapper of the html5 checkbox but already designed to integrate with the rest of the form components.

```jsx
import { Checkbox } from '@guillotinaweb/react-gmi'
// ...
return (
  <Checkbox
    placeholder="Allow this"
    value={value}
    onChange={(checked) => setValue(checked)}
  />
)
```

#### Button

Wrapper of the button of html5 but already thought to integrate with the rest of form components and with a little more flexibility, controlling states like loading.

```jsx
import { Button } from '@guillotinaweb/react-gmi'
// ...
return (
  <Button className="is-warning" loading={loading}>
    Login
  </Button>
)
```

#### FileUpload

It is a ready-to-use input file, along with a label and icon.

```jsx
import { FileUpload } from '@guillotinaweb/react-gmi'
// ...
return <FileUpload onChange={uploadFile} accept="image/*" />
```

### Loading

Displays a loading bar indicating that the content is loading.

```jsx
import { Loading } from '@guillotinaweb/react-gmi'
// ...
return <Loading />
```

## Utils

### RestClient

Necessary for when we create the GuillotinaClient instance to indicate the url where the requests will go and the auth token to be used.

Underneath it uses `fetch`.

```jsx
import { GuillotinaClient, RestClient } from '@guillotinaweb/react-gmi'
// ...
const auth = {
  getToken: () => {
    /* ... */
  },
}
const restClient = new RestClient('/db/guillotina', auth)
const client = new GuillotinaClient(restClient)
```

### classnames

Compose CSS classes in a easy way:

```jsx
import { classnames } from '@guillotinaweb/react-gmi'
// ...
function Example({ className, children }) {
  return (
    <div className={classnames(['notification', 'is-danger', className])}>
      {children}
    </div>
  )
}
```

### stringToSlug

Useful for creating content ids automatically from text but ensuring that it does not have weird characters.

```js
import { stringToSlug } from '@guillotinaweb/react-gmi'
// ...
stringToSlug('This is an example!') // this-is-an-example
```

## Guillotina config

| Option                | Description                                         | Type             | Default                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | --------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icons`               | You can assign a fontawesome icon for each content. | `Object<string>` | `{}`                                                                                                                                                                                                                                                                                                                                                                                                           |
| `PageSize`            | Elements to display in each page                    | `Number`         | `10`                                                                                                                                                                                                                                                                                                                                                                                                           |
| `DelayActions`        | Applies a delay after actions such as refresh.      | `Number`         | `200`                                                                                                                                                                                                                                                                                                                                                                                                          |
| `DisabledTypes`       | Disabled types.                                     | `string[]`       | `["UserManager", "GroupManager"]`                                                                                                                                                                                                                                                                                                                                                                              |
| `Permissions`         | List of permissions.                                | `string[]`       | `["guillotina.AddContent","guillotina.ModifyContent","guillotina.ViewContent","guillotina.DeleteContent","guillotina.AccessContent","guillotina.SeePermissions","guillotina.ChangePermissions","guillotina.MoveContent","guillotina.DuplicateContent","guillotina.ReadConfiguration","guillotina.RegisterConfigurations","guillotina.WriteConfiguration","guillotina.ManageAddons","guillotina.swagger.View"]` |
| `properties_default`  | Default content properties.                         | `string[]`       | `["@id", "@name", "@uid", "title"]`                                                                                                                                                                                                                                                                                                                                                                            |
| `properties_ignore_fields` | List of properties to ignore.                        | `string[]`       | `[guillotina_internals]`                                                                                                                                                                                                                                                                                                                                                                                                    |
| `flash`               | If defined, allows to customize the flash message.  | `function`       | `undefined`                                                                                                                                                                                                                                                                                                                                                                                                    |
