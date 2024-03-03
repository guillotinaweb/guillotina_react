import { Icon } from './ui/icon'
import { useIntl } from 'react-intl'

export function NotAllowed() {
  const intl = useIntl()
  return (
    <div className="box not-allowed">
      <h1 className="title has-text-danger" style={{ fontSize: '4rem' }}>
        <Icon icon="fas fa-ban" />
      </h1>
      <h1 className="title has-text-grey-darker">
        {intl.formatMessage({
          id: 'not_allowed',
          defaultMessage: 'Not Allowed',
        })}
      </h1>
    </div>
  )
}
