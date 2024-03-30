import { Form } from './form'
import { Input } from './input'
import { EmailInput } from './email'
import { PasswordInput } from './password'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { generateUID } from '../../lib/helpers'
import { Children, cloneElement, isValidElement, useRef } from 'react'
import { IndexSignature } from '../../types/global'
import {
  GuillotinaSchema,
  GuillotinaSchemaProperty,
} from '../../types/guillotina'

const formComponents = {
  string: Input,
  password: PasswordInput,
  boolean: Checkbox,
  email: EmailInput,
}

interface Props {
  schema: GuillotinaSchema
  formData?: IndexSignature
  onSubmit: (formData: IndexSignature, initialData: IndexSignature) => void
  actionName: string
  children?: React.ReactNode
  exclude?: string[]
  remotes?: IndexSignature
  submitButton?: boolean
}

export function FormBuilder({
  schema,
  formData,
  onSubmit,
  actionName,
  children,
  exclude = [],
  remotes = {},
  submitButton = true,
}: Props) {
  const ref = useRef<IndexSignature | null>(null)
  const { properties, required } = schema
  const values = Object.assign({}, formData || {})

  // build initial state
  const initialState: IndexSignature = {}
  const fields = Object.keys(properties).filter((x) => !exclude.includes(x))

  fields.forEach((element) => {
    initialState[element] = values[element] || undefined
  })

  // Register remotes
  if (ref.current === null) {
    ref.current = {}
    Object.keys(remotes).forEach((item) => (ref.current![item] = remotes[item]))
  } else {
    // apply remote changes
    Object.keys(remotes).forEach((key) => {
      if (JSON.stringify(ref.current![key]) !== JSON.stringify(remotes[key])) {
        ref.current![key] = remotes[key]
      }
    })
  }

  ref.current = ref.current || {}
  const onUpdate = (field: string) => (value: boolean | string) => {
    ref.current![field] = value
  }

  const GetTag = ({ field }: { field: string }) => {
    const property = properties[field] as GuillotinaSchemaProperty
    const key = (property.widget ||
      property.type) as keyof typeof formComponents

    const Tag: React.ComponentType<any> = formComponents[key]

    const props = {
      value: initialState[field],
      onChange: onUpdate(field),
      placeholder: property.title || '',
      id: generateUID(),
      dataTest: `${field}TestInput`,
      required: false,
    }

    if (required.includes(field)) {
      props.required = true
      props.placeholder += ' *'
    }
    return <Tag {...props} />
  }

  const children_ = Children.map(children, (child) => {
    if (isValidElement(child)) {
      const props = { onChange: onUpdate }
      return cloneElement(child, props)
    }
    return child
  })

  const changes = () => {
    onSubmit(ref.current!, values)
  }

  return (
    <Form onSubmit={changes} dataTest={`formAddUserTest`}>
      {fields.map((field) => (
        <GetTag field={field} key={field} />
      ))}
      {children_}
      {submitButton && <Button>{actionName}</Button>}
    </Form>
  )
}
