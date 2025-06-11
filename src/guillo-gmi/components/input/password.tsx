import { InputHTMLAttributes } from 'react'
import { Input } from './input'

interface Props {
  value: string
  dataTest: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  required?: boolean
}

export const PasswordInput = ({
  value,
  dataTest,
  onChange,
  placeholder,
  id,
  required,
}: Props & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <Input
      value={value}
      type="password"
      dataTest={dataTest}
      onChange={onChange}
      placeholder={placeholder}
      id={id}
      required={required}
    />
  )
}
