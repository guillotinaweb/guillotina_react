import { useTraversal } from '../../contexts'
import { Confirm } from '../modal'
import { useCrudContext } from '../../hooks/useCrudContext'
import { ItemModel } from '../../models'
import { defineMessages, useIntl } from 'react-intl'
import { useEffect, useState } from 'react'

const messages = defineMessages({
  status_changed_ok: {
    id: 'status_changed_ok',
    defaultMessage: 'Great status changed!',
  },
  status_changed_error: {
    id: 'status_changed_error',
    defaultMessage: 'Failed to status changed!: {error}',
  },
  confirm_message: {
    id: 'confirm_message',
    defaultMessage: 'Are you sure to change state: {title}?',
  },
  current_state: {
    id: 'current_state',
    defaultMessage: 'Current state: {state}',
  },
  actions: {
    id: 'actions',
    defaultMessage: 'Actions:',
  },
})

export function IWorkflow() {
  const intl = useIntl()
  const Ctx = useTraversal()
  const { post, loading } = useCrudContext()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')
  const [definition, setDefinition] = useState(undefined)
  const [workflowAction, setWorkflowAction] = useState(null)
  const model = new ItemModel(Ctx.context)
  const currentState =
    model.item['guillotina.contrib.workflows.interfaces.IWorkflowBehavior'][
      'review_state'
    ]

  async function loadDefinition() {
    const response = await Ctx.client.get(`${Ctx.path}/@workflow`)
    const workflow = await response.json()
    setDefinition(workflow)
  }

  useEffect(() => {
    loadDefinition()
  }, [Ctx.path])

  const doWorkflowAction = async () => {
    const { isError, errorMessage } = await post(
      {},
      `@workflow/${workflowAction}`,
      false
    )
    await loadDefinition()
    if (!isError) {
      Ctx.flash(intl.formatMessage(messages.status_changed_ok), 'success')
    } else {
      Ctx.flash(
        intl.formatMessage(messages.status_changed_error, {
          error: errorMessage,
        }),
        'danger'
      )
    }

    Ctx.refresh()
    setWorkflowAction(null)
  }
  if (definition === undefined) return null

  return (
    <>
      {workflowAction && (
        <Confirm
          loading={loading}
          onCancel={() => setWorkflowAction(null)}
          onConfirm={doWorkflowAction}
          message={intl.formatMessage(messages.confirm_message, {
            title: Ctx.context.title || Ctx.context['@name'],
          })}
        />
      )}

      <div className="is-flex is-align-items-center mb-3">
        <div
          className="has-text-weight-bold"
          data-test={`textInfoStatus-${currentState}`}
        >
          {intl.formatMessage(messages.current_state, { state: currentState })}
        </div>
      </div>
      {modifyContent && (
        <div
          className=" is-flex is-align-items-center has-text-weight-bold"
          data-test={`textInfoStatus-${currentState}`}
        >
          <label>{intl.formatMessage(messages.actions)}</label>&nbsp;&nbsp;
          {definition.transitions.map((transition) => {
            return (
              <button
                key={transition['@id']}
                className="button mr-4"
                onClick={() =>
                  setWorkflowAction(
                    transition['@id'].split('@workflow')[1].slice(1)
                  )
                }
              >
                {transition.title}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
