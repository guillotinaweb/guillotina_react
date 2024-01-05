import React from 'react'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

export function PanelNotImplemented(props) {
  const intl = useIntl()
  return (
    <div className="container">
      <h2 className="title">{props.title}</h2>
      <p>{intl.formatMessage(genericMessages.not_implemented)}</p>
    </div>
  )
}
