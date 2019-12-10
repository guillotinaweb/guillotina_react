import React from 'react'
import Form from 'react-jsonschema-form'
import {Tpl, widgets} from './base'


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
      "title": "Email"
    },
    "name": {
      "type": "string",
      "title": "Name"
    },
    "password": {
      "type": "string",
      "title": "Password",
      "format": "password"
    },
    "disabled": {
      "type": "boolean",
      "title": "Disabled"
    }
  }
}


export function AddUserForm({onSubmit, onError, actionName, formData, title}) {


  return (
    <>
      {title && <h3
        className="title is-size-4 has-text-info">{title}</h3>}
      <Form schema={schema}
          onSubmit={onSubmit}
          onError={onError}
          FieldTemplate={Tpl}
          widgets={widgets}
          formData={formData}
      >
        <div className="level level-right">
        <button type="submit"
          className="button is-success">
          {actionName || 'Add'}
        </button>
        </div>
      </Form>
    </>
  )

}

