import { Input } from './input'
import { isEmail } from '../../lib/validators'
import { Icon } from '../ui/icon'
import { useIntl } from 'react-intl'

interface Props {
  value?: string
  dataTest?: string
  onChange?: (value: string) => void
  placeholder?: string
  id?: string
}
export const EmailInput = ({
  value = '',
  dataTest,
  placeholder,
  id,
  onChange,
}: Props) => {
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
      dataTest={dataTest}
      icon={<Icon icon="fas fa-envelope" />}
      id={id}
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}
