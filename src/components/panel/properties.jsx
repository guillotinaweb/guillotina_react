import React from 'react'
import { TraversalContext } from "../../contexts";



export function PanelItemProperties(props) {
  const Ctx = React.useContext(TraversalContext)

  return (
    <div className="container">
      <h2 className="title">{props.title}</h2>
      <p>Not implemented</p>
    </div>
  )

}
