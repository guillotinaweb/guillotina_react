import React from 'react'
import { Input } from './input'
import { isEmail } from '../../lib/validators'
import { Icon } from '../ui/icon'
import { useIntl } from 'react-intl'

export const EmailInput = ({ value = '', dataTest, ...rest }) => {
  const intl = useIntl()
  return (
    <Input
      type="email"
      validator={isEmail}
      errorMessage={intl.formatMessage({
        id: 'invalid_email',
        defaultMessage: 'Invalid email',
      })}
      value={value}
      data-test={dataTest}
      icon={<Icon icon="fas fa-envelope" />}
      {...rest}
    />
  )
}
