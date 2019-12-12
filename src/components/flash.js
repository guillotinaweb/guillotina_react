import React from 'react'
import {TraversalContext} from '../contexts'
import {Notification} from 'bloomer'
import {Delete} from 'bloomer'


export function Flash() {
  const Ctx = React.useContext(TraversalContext)
  const {flash} = Ctx.state

  if (!flash.message) return null

  return (
    <Notification isColor={flash.type}>
        {flash.message}
        <Delete onClick={() => Ctx.clearFlash()} />
    </Notification>
  )

}
