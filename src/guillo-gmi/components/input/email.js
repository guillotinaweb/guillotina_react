import React from 'react'
import { Input } from './input'
import { isEmail } from '../../lib/validators'
import { Icon } from '../ui/icon'

export const EmailInput = ({ value = '', ...rest }) => {
  return (
    <Input
      type="email"
      validator={isEmail}
      errorMessage="Email address invalid"
      value={value}
      icon={<Icon icon="fas fa-envelope" />}
      {...rest}
    />
  )
}
