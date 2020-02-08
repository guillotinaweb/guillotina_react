
import React from "react"
import { TraversalContext } from "../contexts";


export function PropertiesButtonView(properties) {
  const Ctx = React.useContext(TraversalContext)
  const {getProperties} = Ctx.registry

  const Props = getProperties(Ctx.context["@type"])

  if (Props.Buttons) {
    const Element = React.cloneElement(Props.Buttons, {Ctx: Ctx})
    return Element
  }
  return null
}


export function PropertiesView(props) {
  const Ctx = React.useContext(TraversalContext)
  const {getProperties} = Ctx.registry
  const Props = getProperties(Ctx.context["@type"])


  if (Props.Panels) {
    const Element = React.cloneElement(Props.Panels, {Ctx: Ctx})
    return Element
  }
  return null
}
