import { useTraversal } from '../contexts'
import { get } from '../lib/utils'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'
import { GuillotinaCommonObject, GuillotinaSchema } from '../types/guillotina'

interface Props {
  context: GuillotinaCommonObject
  schema: GuillotinaSchema
}
export function BehaviorsView({ context, schema }: Props) {
  const Ctx = useTraversal()
  const { getBehavior } = Ctx.registry

  const behaviors: string[] = [
    ...(context.__behaviors__ ?? []),
    ...Object(context['@static_behaviors']),
  ]

  const GetBehavior = (behaviorName: string) => {
    const Cls = getBehavior(behaviorName, BehaviorNotImplemented)
    return (
      <Cls
        values={context[behaviorName as keyof GuillotinaCommonObject]}
        properties={get(
          schema,
          ['definitions', behaviorName, 'properties'],
          {}
        )}
      />
    )
  }

  return (
    <>
      {behaviors.map((behavior) => (
        <div className="container" key={behavior}>
          <h3 className="title is-size-6 has-text-grey">{behavior}</h3>
          {GetBehavior(behavior)}
          <hr />
        </div>
      ))}
    </>
  )
}

export function BehaviorNotImplemented() {
  const intl = useIntl()
  return (
    <tr>
      <td colSpan={3}>{intl.formatMessage(genericMessages.not_implemented)}</td>
    </tr>
  )
}
