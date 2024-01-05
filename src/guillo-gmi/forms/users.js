import React from 'react'
import { FormBuilder } from '../components/input/form_builder'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

export const UserForm = ({ isEdit = false, children, ...props }) => {
  const intl = useIntl()
  const attr = isEdit
    ? {}
    : {
        title: intl.formatMessage(genericMessages.add_user),
      }
  const schema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string',
        title: intl.formatMessage({
          id: 'username',
          defaultMessage: 'Username',
        }),
      },
      email: {
        type: 'string',
        title: intl.formatMessage({
          id: 'email',
          defaultMessage: 'Email',
        }),
        widget: 'email',
      },
      name: {
        type: 'string',
        title: intl.formatMessage({
          id: 'name',
          defaultMessage: 'Name',
        }),
      },
      password: {
        type: 'string',
        title: intl.formatMessage({
          id: 'password',
          defaultMessage: 'Password',
        }),
        widget: 'password',
      },
      disabled: {
        type: 'boolean',
        title: 'Disabled',
      },
    },
  }
  return (
    <FormBuilder schema={schema} {...props} {...attr}>
      {children}
    </FormBuilder>
  )
}
