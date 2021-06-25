import React from 'react'
import { Input } from './input'
import { isEmail } from '../../lib/validators'
import { Icon } from '../ui/icon'

export const EmailInput = ({ value = '', dataTest, ...rest }) => {
  return (
    <Input
      type="email"
      validator={isEmail}
      errorMessage="Email address invalid"
      value={value}
      data-test={dataTest}
      icon={<Icon icon="fas fa-envelope" />}
      {...rest}
    />
  )
}
