import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

interface Props {
  title: string
}
export function PanelNotImplemented(props: Props) {
  const intl = useIntl()
  return (
    <div className="container">
      <h2 className="title">{props.title}</h2>
      <p>{intl.formatMessage(genericMessages.not_implemented)}</p>
    </div>
  )
}
