
import React from 'react'
import {useCrudContext} from '../../hooks/useCrudContext'


export function PanelDocs(props) {

  const {Ctx} = useCrudContext()

  return (
    <iframe src={(Ctx.url + Ctx.path + "@docs")} />
  )

}
