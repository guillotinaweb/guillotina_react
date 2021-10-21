# Guillotina React API

- [Architecture](#architecture)
- [Traversal Context](#traversal-context)
- [Hooks](#hooks)
  - [useLocation](#uselocation)
  - [useConfig](#useconfig)
  - [useCrudContext](#usecrudcontext)
  - [useRegistry](#useregistry)
  - [useGuillotinaClient](#useguillotinaclient)
- [Components](#components)
  - [Guillotina](#guillotina)
  - [TabsPanel](#tabspanel)
  - [ContextToolbar](#contexttoolbar)
  - [PanelPermissions / PanelProperties / PanelItems](#panelpermissions--panelproperties--panelitems)
  - [Icon](#icon)
  - [Modal](#modal)
  - [Form](#form)
  - [RequiredFieldsForm](#requiredfieldsform)
    - [Input](#input)
    - [Textarea](#textarea)
    - [Select](#select)
    - [Checkbox](#checkbox)
    - [Button](#button)
    - [FileUpload](#fileupload)
    - [InputList](#inputlist)
    - [Searchinput](#searchinput)
    - [EditableField](#editablefield)
    - [EditComponent](#editcomponent)
    - [RenderFieldComponent](#renderfieldcomponent)
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

- There is a "hook registry (useRegistry)" to be able to override components, on installations. You can override `views`, `components`, `actions`, `forms`, `behaviors`, `itemsColumn` 
  - paths
    - Stores views for paths

  - views
    - Stores views for content type

  - components
    - You can override `Path`, `EditComponent` and `RenderFieldComponent` 

  - actions

    - Actions are mostly UI interactions you trigger from buttons (remove item)
      and when adding types (Context menu +)
    - They mostly are based on a "modal" that proposes you something
    - Actions can be dispatched, using the main Context

    ```
    Ctx = useTraversal()
    Ctx.doAction("addItem" , "Folder")
    ```

    will show a modal to add an item for a folder

  - forms
    - Define default form by each content type
  
  - behaviors
    - Define each component to each behavior to render in properties view
  
  - itemsColumn
    - Allow override table columns in items view. By default items columns are defined in getItemsColumn function in client lib. 

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
Ctx.hasPerm // Check permission in current context
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

### useConfig

Hook to get and override config (#guillotina-config)

```jsx
import { useConfig } from '@guillotinaweb/react-gmi'

// ...
const conf = useConfig(overrideConifg)
```

### useCrudContext

This hook exposes CRUD methods, traversal context and request state. Each CRUD method returns state too. 

Request state:
```jsx
  const state = {
    loading: undefined,
    isError: false,
    errorMessage: undefined,
    result: undefined,
    response: undefined,
  }
```

```jsx
import { useCrudContext } from '@guillotinaweb/react-gmi'

// ...
const {result, response, loading, isError, errorMessage, get, post, put, delete, traversal} = useCrudContext()
```

#### Example

```jsx
import { useCrudContext } from '@guillotinaweb/react-gmi'

// ...
const { post, loading } = useCrudContext()

async function doSubmit(data){
  const { isError, errorMessage } = await post(data)
    if (!isError) {
      // ... 
    } else {
      // ... 
    }
}
```

### useRegistry

This hook exposes registry object and some functions to get info from it. 


```jsx
registry
get(key, param, fallback);
getComponent(context, path, fallback)
getItemsColumn(type)
getForm(type, fallback = BaseForm)
getAction(type, fallback)
getBehavior(type, fallback)
getProperties(type)
```


#### Example 

```jsx
import { useRegistry } from '@guillotinaweb/react-gmi'

// ...
const registry = useRegistry()

const NotFound = registry.get('views', 'NotFound')
const Path = registry.get('components', 'Path')

const Main = registry.getComponent(state.context, path)
const Action = action.action ? registry.getAction(action.action) : null

```
### useGuillotinaClient

This hook exposes the client to interact with api 

#### Example 

```jsx
import { useGuillotinaClient } from '@guillotinaweb/react-gmi'

// ...
const client = useGuillotinaClient()

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
  <Form onSubmit={submit} title="My form">
    {/* all form components here */}
  </Form>
)
```
### RequiredFieldsForm

Wrapper of Form component, it's render all required properties of content type


```jsx
import { RequiredFieldsForm } from '@guillotinaweb/react-gmi'
// ...
return (
  <RequiredFieldsForm onSubmit={submit} title="My form" actionName="Add" type="MyContentType" />
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

#### InputList

It is a ready-to-use input list. 

```jsx
import { InputList } from '@guillotinaweb/react-gmi'
// ...
return <InputList value={val} onChange={onChange} />
```
#### SearchInput

Search input

```jsx
import { SearchInput } from '@guillotinaweb/react-gmi'
// ...
let sortParsed = parser(`_sort_asc=id`)
let searchParsed = parser('type_name=User')

return (
  <SearchInput
    path={path}
    qs={[...searchParsed, ...sortParsed]}
    traversal={traversal}
    onChange={onChange}
  />
)

```

#### EditableField

Allows you to modify each property of the object. Depends if it is in edit mode or view mode, it renders an input form or the formatted value of property. It recieves a json schema to know what have it render. 

```jsx
import { EditableField } from '@guillotinaweb/react-gmi'
//...
<EditableField
  field={prop}
  value={Ctx.context[prop]}
  modifyContent={false}
/>
```

#### EditComponent

Is is in charge of renders edit component according schema information when EditableField is in `EditMode`. You can override it from the registry to change the input to render according to JSON schema.

[Default component](../src/guillo-gmi/components/fields/editComponent.js)

How to override:

```jsx
import { EditComponent } from '../your-path'
// ...
const registry = {
  components: {
    EditComponent:EditComponent
  }
}

<Guillotina {...props} registry={registry}>
```

#### RenderFieldComponent

Is is in charge of renders the value when EditableField is in `ViewMode`. You can override it from the registry to change the input to render according to JSON schema

[Default component](../src/guillo-gmi/components/fields/renderField.js#44)

How to override:

```jsx
import { RenderFieldComponent } from '../your-path'
// ...
const registry = {
  components: {
    RenderFieldComponent: RenderFieldComponent
  }
}

<Guillotina {...props} registry={registry}>
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
| `SearchEngine`               | Search engine used.  | `string`       | `PostreSQL`                                                                                                                                                                                                                                                                                                                                                                                                    |
| `fieldHaveDeleteButton`               | Define which fields have delete button in properties view by schema | `function`       | <span>(schema) =>  schema?.widget === 'file' &#124;&#124; schema?.widget === 'select' &#124;&#124; schema?.type === 'array' </span>                                                                                                                                                                                                                                                                                                                                                                                                    |
