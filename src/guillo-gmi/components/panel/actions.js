import * as React from 'react'
import { useTraversal } from '../../contexts'

export const ACTIONS_OBJECT = {
  DELETE: {
    text: 'Delete',
    perms: ['guillotina.DeleteContent'],
    action: 'removeItem',
  },
  MOVE: {
    text: 'Move to...',
    perms: ['guillotina.MoveContent'],
    action: 'moveItem',
  },
  COPY: {
    text: 'Copy to...',
    perms: ['guillotina.DuplicateContent'],
    action: 'copyItem',
  },
}

export function PanelActions() {
  const traversal = useTraversal()

  const hasPerm = (perms) => {
    return perms.some((perm) => traversal.hasPerm(perm))
  }

  const onAction = (actionKey) => {
    traversal.doAction(ACTIONS_OBJECT[actionKey].action, {
      item: traversal.context,
    })
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
