import React from 'react'

export function Notification({ isColor = '', children }) {
  return (
    <div className={'notification is-' + isColor} data-test="notificationTest">
      {children}
    </div>
  )
}
