import React from 'react'
import { Form } from './form'
import { Input } from './input'
import { EmailInput } from './email'
import { PasswordInput } from './password'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { generateUID } from '../../lib/helpers'

const formComponents = {
  string: Input,
  password: PasswordInput,
  boolean: Checkbox,
  email: EmailInput,
}

export function FormBuilder({
  schema,
  formData,
  title,
  onSubmit,
  actionName,
  children,
  exclude = [],
  remotes = [],
  submitButton = true,
  ...rest
}) {
  const ref = React.useRef()
  const { properties, required } = schema
  const values = Object.assign({}, formData || {})

  // build initial state
  let initialState = {}
  const fields = Object.keys(properties).filter((x) => !exclude.includes(x))

  fields.forEach((element) => {
    initialState[element] = values[element] || undefined
  })

  // Register remotes
  if (!ref.current) {
    ref.current = {}
    Object.keys(remotes).forEach((item) => (ref.current[item] = remotes[item]))
  } else {
    // apply remote changes
    Object.keys(remotes).forEach((key) => {
      if (JSON.stringify(ref.current[key]) !== JSON.stringify(remotes[key])) {
        ref.current[key] = remotes[key]
      }
    })
  }

  ref.current = ref.current || {}
  const onUpdate = (field) => (ev) => {
    ref.current[field] = ev.target ? ev.target.value : ev.value || ev
  }

  const GetTag = ({ field }) => {
    const Tag =
      formComponents[properties[field].widget || properties[field].type]

    const props = {
      label: properties[field].title,
      value: initialState[field],
      onChange: onUpdate(field),
      placeholder: properties[field].title || '',
      id: generateUID(),
    }

    if (required.includes(field)) {
      props.required = true
      props.placeholder += ' *'
    }
    Tag.displayName = `${field}Field`
    return <Tag {...props} />
  }

  const children_ = React.Children.map(children, (child) =>
    React.cloneElement(child, { onChange: onUpdate })
  )

  const changes = () => {
    onSubmit(ref.current, values)
  }

  return (
    <Form onSubmit={changes} {...rest}>
      {fields.map((field, i) => (
        <GetTag field={field} key={field} />
      ))}
      {children_}
      {submitButton && <Button>{actionName}</Button>}
    </Form>
  )
}
