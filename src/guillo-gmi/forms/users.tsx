import { FormBuilder } from '../components/input/form_builder'
import { useIntl } from 'react-intl'
import { IndexSignature } from '../types/global'

interface Props {
  children: React.ReactNode
  onSubmit: (data: IndexSignature) => void
  actionName?: string
  formData?: IndexSignature
  exclude?: string[]
  remotes?: IndexSignature
  submitButton?: boolean
}
export const UserForm = ({
  children,
  actionName,
  onSubmit,
  formData,
  exclude,
  remotes,
  submitButton,
}: Props) => {
  const intl = useIntl()

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
    <FormBuilder
      schema={schema}
      actionName={actionName}
      onSubmit={onSubmit}
      formData={formData}
      exclude={exclude}
      remotes={remotes}
      submitButton={submitButton}
    >
      {children}
    </FormBuilder>
  )
}
