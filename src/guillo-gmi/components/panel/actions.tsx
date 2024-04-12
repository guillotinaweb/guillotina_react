import { useTraversal } from '../../contexts'
import { useIntl } from 'react-intl'
import { getActionsObject } from '../../lib/helpers'
import { Fragment } from 'react'

export function PanelActions() {
  const traversal = useTraversal()
  const intl = useIntl()
  const ACTIONS_OBJECT = getActionsObject(intl)

  const hasPerm = (perms: string[]) => {
    return perms.some((perm) => traversal.hasPerm(perm))
  }

  const onAction = (actionKey: keyof typeof ACTIONS_OBJECT) => {
    traversal.doAction(ACTIONS_OBJECT[actionKey].action, {
      item: traversal.context,
    })
  }

  return (
    <Fragment>
      {Object.keys(ACTIONS_OBJECT).map((actionKey) => {
        const actionKeyTyped = actionKey as keyof typeof ACTIONS_OBJECT
        const actionObject = ACTIONS_OBJECT[actionKeyTyped]
        if (hasPerm(actionObject.perms)) {
          return (
            <button
              key={`panel_action_${actionObject.text}`}
              className="button mr-4"
              onClick={() => {
                onAction(actionKeyTyped)
              }}
            >
              {actionObject.text}
            </button>
          )
        }
      })}
    </Fragment>
  )
}
