import React from 'react'
import { useTraversal } from '../contexts'
import { get } from '../lib/utils'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

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
          {GetBehavior(behavior)}
          <hr />
        </div>
      ))}
    </React.Fragment>
  )
}

export function BehaviorNotImplemented() {
  const intl = useIntl()
  return (
    <tr>
      <td colSpan="3">{intl.formatMessage(genericMessages.not_implemented)}</td>
    </tr>
  )
}
