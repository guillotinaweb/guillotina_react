import { InputHTMLAttributes } from 'react'
import { Input } from './input'

interface Props {
  value: string
  dataTest: string
  onChange: (value: string) => void
}

export const PasswordInput = ({
  value,
  dataTest,
  onChange,
}: Props & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <Input
      value={value}
      type="password"
      dataTest={dataTest}
      onChange={onChange}
    />
  )
}
