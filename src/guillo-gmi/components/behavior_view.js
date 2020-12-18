import React from 'react'
import { Table } from './ui/table'
import { TraversalContext } from '../contexts'

export function BehaviorsView({ context }) {
  const Ctx = React.useContext(TraversalContext)
  const { getBehavior } = Ctx.registry

  const behaviors = [].concat(
    context.__behaviors__,
    context['@static_behaviors']
  )
  const GetBehavior = (b) => {
    const Cls = getBehavior(b, BehaviorNotImplemented)
    return <Cls {...context[b]} />
  }

  return (
    <React.Fragment>
      {behaviors.map((behavior) => (
        <div className="container" key={behavior}>
          <h3 className="title is-size-6 has-text-grey">{behavior}</h3>
          <Table
            headers={['Field', 'Value']}
            className="is-striped is-fullwidth is-size-7"
          >
            {GetBehavior(behavior)}
          </Table>
          <hr />
        </div>
      ))}
    </React.Fragment>
  )
}

export function BehaviorNotImplemented() {
  return (
    <tr>
      <td colSpan="3">Not Implemented</td>
    </tr>
  )
}

/*
<tr>
  <td>Creators</td>
  <td>{Ctx.context.creators.map(item =>
    <Author name={item}  key={'a' + item} />
    )}</td>
</tr> */
