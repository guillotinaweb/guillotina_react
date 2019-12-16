import React from 'react'
import {Icon} from './ui/icon'


export function NotAllowed() {
  return (
    <div className="box not-allowed">
      <h1 className="title has-text-danger"
        style={{fontSize: '4rem'}}><Icon icon="fas fa-ban"/></h1>
      <h1 className="title has-text-grey-darker">Not Allowed</h1>

    </div>
  )
}
