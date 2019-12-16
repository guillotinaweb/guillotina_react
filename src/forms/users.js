import React from 'react'
import {FormBuilder} from '../components/input/form_builder'

const schema = {
  "type": "object",
  "required": [
    "username",
    "password",
  ],
  "properties": {
    "username": {
      "type": "string",
      "title": "Username"
    },
    "email": {
      "type": "string",
      "title": "Email",
      "widget": "email"
    },
    "name": {
      "type": "string",
      "title": "Name"
    },
    "password": {
      "type": "string",
      "title": "Password",
      "widget": "password"
    },
    "disabled": {
      "type": "boolean",
      "title": "Disabled"
    }
  }
}

export const UserForm = ({isEdit=false, children, ...props}) => {

  const attr = (isEdit) ? {} : {"title": "Add User"}

  return (
      <FormBuilder
          schema={schema}
          {...props}
          {...attr}
          >
        {children}
      </FormBuilder>
  )
}

