import React from 'react'
import {Icon} from './ui/icon'


export function NotFound() {
  return (
    <div className="box not-allowed">
      <h1 className="title has-text-grey"
        style={{fontSize: '4rem'}}><Icon icon="fas fa-dizzy"/></h1>
      <h1 className="title has-text-grey-darker">404. Not Found</h1>

    </div>
  )
}
