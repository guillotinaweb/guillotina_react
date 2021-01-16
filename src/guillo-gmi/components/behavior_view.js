import React from 'react'
import { Table } from './ui/table'
import { useTraversal } from '../contexts'
import { get } from '../lib/utils'

export function BehaviorsView({ context, schema }) {
  const Ctx = useTraversal()
  const { getBehavior } = Ctx.registry

  const behaviors = [].concat(
    context.__behaviors__,
    context['@static_behaviors']
  )
  const GetBehavior = (b) => {
    const Cls = getBehavior(b, BehaviorNotImplemented)
    return (
      <Cls
        values={context[b]}
        properties={get(schema, ['definitions', b, 'properties'], {})}
      />
    )
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
