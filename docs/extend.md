# Extending Guillotina React

Guillotina React is built around the idea of acting as a framework layer that can be extended from outside. Instead of forking the library, you can customize and extend it through the **registry pattern**, allowing you to override views, forms, actions, behaviors, and more while maintaining upgradability.

## Overview

The registry system is the core architectural feature that enables complete UI customization. You can override components per content type, add custom actions, define behavior renderers, and customize table columns—all without modifying the core library.

## Basic Usage

Import the main `Guillotina` component and pass your customizations through the `registry` prop:

```tsx
import { Guillotina, Auth, getClient, ClientProvider } from '@guillotinaweb/react-gmi'

const auth = new Auth('http://localhost:8080')
const client = getClient('http://localhost:8080', '/', auth)

const registry = {
  views: {
    MyCustomType: MyCustomView,
  },
  forms: {
    MyCustomType: MyCustomForm,
  },
  // ... more overrides
}

function App() {
  return (
    <ClientProvider client={client}>
      <Guillotina auth={auth} url="/" registry={registry} />
    </ClientProvider>
  )
}
```

## Registry Types

### Views

Override the view component for a specific content type. Views determine how a content object is displayed.

```tsx
import {
  TabsPanel,
  ContextToolbar,
  PanelItems,
  PanelProperties,
  PanelPermissions,
  useTraversal,
} from '@guillotinaweb/react-gmi'

export function MyCustomTypeView(props: any) {
  const ctx = useTraversal()
  
  const tabs = {
    Items: PanelItems,
    Properties: PanelProperties,
    Permissions: PanelPermissions,
    Custom: () => <div>Custom content here</div>,
  }

  const tabsPermissions = {
    Items: 'guillotina.ViewContent',
    Properties: 'guillotina.ViewContent',
    Permissions: 'guillotina.SeePermissions',
    Custom: 'guillotina.ViewContent',
  }

  const filteredTabs = ctx.filterTabs(tabs, tabsPermissions)

  return (
    <TabsPanel
      tabs={filteredTabs}
      currentTab="Items"
      rightToolbar={<ContextToolbar {...props} />}
      {...props}
    />
  )
}

// Register it
const registry = {
  views: {
    MyCustomType: MyCustomTypeView,
  },
}
```

### Forms

Define custom forms for content types. Forms are used when creating or editing content.

```tsx
import { Form, Input, Button, useCrudContext } from '@guillotinaweb/react-gmi'

export function MyCustomTypeForm({ onSubmit, title, type }: any) {
  const { post, loading } = useCrudContext()
  const [formData, setFormData] = useState({ title: '', description: '' })

  const handleSubmit = async () => {
    const { isError } = await post(formData)
    if (!isError) {
      onSubmit()
    }
  }

  return (
    <Form onSubmit={handleSubmit} title={title}>
      <Input
        value={formData.title}
        onChange={(val) => setFormData({ ...formData, title: val })}
        placeholder="Title"
      />
      <Input
        value={formData.description}
        onChange={(val) => setFormData({ ...formData, description: val })}
        placeholder="Description"
      />
      <Button loading={loading}>Save</Button>
    </Form>
  )
}

// Register it
const registry = {
  forms: {
    MyCustomType: MyCustomTypeForm,
  },
}
```

Alternatively, use `RequiredFieldsForm` to automatically render all required fields:

```tsx
import { RequiredFieldsForm } from '@guillotinaweb/react-gmi'

const registry = {
  forms: {
    MyCustomType: RequiredFieldsForm,
  },
}
```

### Actions

Override or add custom actions. Actions are typically modal dialogs triggered by buttons.

```tsx
import { Modal, Button, useTraversal } from '@guillotinaweb/react-gmi'

export function MyCustomAction({ onClose }: any) {
  const ctx = useTraversal()

  const handleAction = async () => {
    // Perform your action
    await ctx.client.patch(ctx.path, { /* data */ })
    ctx.flash('Action completed!', 'success')
    ctx.refresh()
    onClose()
  }

  return (
    <Modal isActive={true} setActive={onClose}>
      <div className="modal-content">
        <h2>Custom Action</h2>
        <p>Perform your custom action here.</p>
        <Button onClick={handleAction}>Execute</Button>
      </div>
    </Modal>
  )
}

// Register it
const registry = {
  actions: {
    myCustomAction: MyCustomAction,
  },
}

// Trigger it from anywhere
const ctx = useTraversal()
ctx.doAction('myCustomAction')
```

### Behaviors

Define components to render behavior data in the Properties tab.

```tsx
import { useCrudContext, Button, FileUpload } from '@guillotinaweb/react-gmi'

export function MyCustomBehavior({ properties, values }: any) {
  const { Ctx } = useCrudContext()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')

  return (
    <div className="panel">
      <div className="panel-heading">My Custom Behavior</div>
      <div className="panel-block">
        {modifyContent ? (
          <FileUpload onChange={(file) => {/* handle upload */}} />
        ) : (
          <div>View mode: {values?.someField}</div>
        )}
      </div>
    </div>
  )
}

// Register it
const registry = {
  behaviors: {
    'my.package.behaviors.IMyBehavior': MyCustomBehavior,
  },
}
```

### Items Column

Customize the columns displayed in the items list view.

```tsx
import { Icon, TdLink } from '@guillotinaweb/react-gmi'

export const MyCustomTypeColumns = () => {
  return [
    {
      label: '',
      child: (model: any) => (
        <td style={{ width: 25 }}>
          <Icon icon={model.icon} />
        </td>
      ),
    },
    {
      label: 'Name',
      key: 'title',
      isSortable: true,
      child: (model: any) => (
        <TdLink model={model}>{model.name}</TdLink>
      ),
    },
    {
      label: 'Custom Field',
      key: 'custom_field',
      isSortable: false,
      child: (model: any) => (
        <td>{model.custom_field || 'N/A'}</td>
      ),
    },
  ]
}

// Register it
const registry = {
  itemsColumn: {
    MyCustomType: MyCustomTypeColumns,
  },
}
```

### Components

Override core components like `EditComponent` and `RenderFieldComponent` to customize how fields are rendered.

```tsx
import { Input, Textarea, Select } from '@guillotinaweb/react-gmi'

export const CustomEditComponent = React.forwardRef(
  ({ schema, val, setValue, ...rest }: any, ref: any) => {
    if (schema?.widget === 'richtext') {
      return <RichTextEditor value={val} onChange={setValue} />
    }
    
    if (schema?.type === 'boolean') {
      return <Checkbox value={val} onChange={setValue} />
    }

    return <Input value={val} onChange={setValue} ref={ref} {...rest} />
  }
)

// Register it
const registry = {
  components: {
    EditComponent: CustomEditComponent,
  },
}
```

### Paths

Override views for specific paths (useful for special routes).

```tsx
const registry = {
  paths: {
    '/db/container/special-path': SpecialPathView,
  },
}
```

### Schemas

Configure search filters and other schema-specific options.

```tsx
const registry = {
  schemas: {
    MyCustomType: {
      filters: [
        {
          attribute_key: 'status',
          label: 'Status',
          type: 'select',
          values: [
            { value: 'active', text: 'Active' },
            { value: 'inactive', text: 'Inactive' },
          ],
        },
      ],
    },
  },
}
```

### Properties

Configure which properties to show or hide in the Properties tab.

```tsx
const registry = {
  properties: {
    MyCustomType: {
      Buttons: null, // Hide buttons
      ignoreField: ['internal_field'], // Hide specific fields
    },
  },
}
```

### Actions List

Override the actions available in the items list toolbar.

```tsx
const registry = {
  actionsList: {
    MyCustomType: (multiple: boolean) => ({
      customAction: {
        text: { id: 'custom_action', defaultMessage: 'Custom Action' },
        perms: ['guillotina.ModifyContent'],
        action: 'myCustomAction',
      },
    }),
  },
}
```

## Complete Example

Here's a complete example showing multiple registry overrides:

```tsx
import { Guillotina, Auth, getClient, ClientProvider } from '@guillotinaweb/react-gmi'
import { MyCustomTypeView } from './views/MyCustomTypeView'
import { MyCustomTypeForm } from './forms/MyCustomTypeForm'
import { MyCustomAction } from './actions/MyCustomAction'
import { MyCustomBehavior } from './behaviors/MyCustomBehavior'
import { MyCustomTypeColumns } from './columns/MyCustomTypeColumns'

const auth = new Auth('http://localhost:8080')
const client = getClient('http://localhost:8080', '/', auth)

const registry = {
  views: {
    MyCustomType: MyCustomTypeView,
  },
  forms: {
    MyCustomType: MyCustomTypeForm,
  },
  actions: {
    myCustomAction: MyCustomAction,
  },
  behaviors: {
    'my.package.behaviors.IMyBehavior': MyCustomBehavior,
  },
  itemsColumn: {
    MyCustomType: MyCustomTypeColumns,
  },
  schemas: {
    MyCustomType: {
      filters: [
        {
          attribute_key: 'status',
          label: 'Status',
          type: 'select',
          values: [
            { value: 'active', text: 'Active' },
            { value: 'inactive', text: 'Inactive' },
          ],
        },
      ],
    },
  },
}

function App() {
  return (
    <ClientProvider client={client}>
      <Guillotina auth={auth} url="/" registry={registry} />
    </ClientProvider>
  )
}
```

## Best Practices

1. **Type Safety**: Use TypeScript interfaces for your registry entries to ensure type safety.

2. **Composition**: Build on top of existing components rather than replacing them entirely when possible.

3. **Permissions**: Always check permissions using `ctx.hasPerm()` before rendering edit controls.

4. **Traversal Context**: Use `useTraversal()` hook to access current context, path, and helper methods.

5. **Error Handling**: Handle errors gracefully and use `ctx.flash()` to show user feedback.

6. **Internationalization**: Use `react-intl` for all user-facing strings.

## Related Documentation

- [API Documentation](api.md) - Complete API reference
- [Tutorial](tutorial/tutorial.md) - Step-by-step guide with examples
- [Development Setup](development-setup.md) - Local development environment
