import React from 'react'
import {TraversalContext} from '../contexts'
import {Notification} from 'bloomer'
import {Delete} from 'bloomer'


export function Flash() {
  const Ctx = React.useContext(TraversalContext)

  if (!Ctx.flash.message) return null

  return (
    <Notification isColor={Ctx.flash.type}>
        {Ctx.flash.message}
        <Delete onClick={Ctx.clearFlash} />
    </Notification>
  )

}
