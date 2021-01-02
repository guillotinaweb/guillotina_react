import React from 'react'
import { useTraversal } from '../contexts'

export function PropertiesButtonView() {
  const Ctx = useTraversal()
  const { getProperties } = Ctx.registry

  const Props = getProperties(Ctx.context['@type'])

  if (Props.Buttons) {
    const Element = React.cloneElement(Props.Buttons, { Ctx: Ctx })
    return Element
  }
  return null
}

export function PropertiesView() {
  const Ctx = useTraversal()
  const { getProperties } = Ctx.registry
  const Props = getProperties(Ctx.context['@type'])

  if (Props.Panels) {
    const Element = React.cloneElement(Props.Panels, { Ctx: Ctx })
    return Element
  }
  return null
}
