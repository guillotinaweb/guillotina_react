import { useTraversal } from '../../contexts'
import { useIntl } from 'react-intl'
import { getActionsObject } from '../../lib/helpers'
import { Fragment } from 'react'

export function PanelActions() {
  const traversal = useTraversal()
  const intl = useIntl()
  const ACTIONS_OBJECT = getActionsObject(intl)

  const hasPerm = (perms) => {
    return perms.some((perm) => traversal.hasPerm(perm))
  }

  const onAction = (actionKey) => {
    traversal.doAction(ACTIONS_OBJECT[actionKey].action, {
      item: traversal.context,
    })
  }

  return (
    <Fragment>
      {Object.keys(ACTIONS_OBJECT).map((actionKey) => {
        if (hasPerm(ACTIONS_OBJECT[actionKey].perms)) {
          return (
            <button
              key={`panel_action_${ACTIONS_OBJECT[actionKey].text}`}
              className="button mr-4"
              onClick={() => {
                onAction(actionKey)
              }}
            >
              {ACTIONS_OBJECT[actionKey].text}
            </button>
          )
        }
      })}
    </Fragment>
  )
}
