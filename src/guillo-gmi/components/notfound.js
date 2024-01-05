import React from 'react'
import { Icon } from './ui/icon'
import { useIntl } from 'react-intl'

export function NotFound() {
  const intl = useIntl()
  return (
    <div className="box not-allowed">
      <h1 className="title has-text-grey" style={{ fontSize: '4rem' }}>
        <Icon icon="fas fa-dizzy" />
      </h1>
      <h1 className="title has-text-grey-darker">
        {intl.formatMessage({
          id: 'not_found',
          defaultMessage: '404. Not Found',
        })}
      </h1>
    </div>
  )
}
