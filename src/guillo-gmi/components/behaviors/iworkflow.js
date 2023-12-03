import React from 'react'
import { useTraversal } from '../../contexts'
import { Confirm } from '../modal'
import { useCrudContext } from '../../hooks/useCrudContext'
import { ItemModel } from '../../models'

export function IWorkflow() {
  const Ctx = useTraversal()
  const { post, loading } = useCrudContext()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')
  const [definition, setDefinition] = React.useState(undefined)
  const [workflowAction, setWorkflowAction] = React.useState(null)
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

  React.useEffect(() => {
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
      Ctx.flash(`Great status changed!`, 'success')
    } else {
      Ctx.flash(`Failed to status changed!: ${errorMessage}`, 'danger')
    }

    Ctx.refresh()
    setWorkflowAction(null)
  }
  if (definition === undefined) return null

  return (
    <React.Fragment>
      {workflowAction && (
        <Confirm
          loading={loading}
          onCancel={() => setWorkflowAction(null)}
          onConfirm={doWorkflowAction}
          message={`Are you sure to change state: ${
            Ctx.context.title || Ctx.context['@name']
          }?`}
        />
      )}

      <div className="is-flex is-align-items-center mb-3">
        <div
          className="has-text-weight-bold"
          data-test={`textInfoStatus-${currentState}`}
        >
          Current state: {currentState}
        </div>
      </div>
      {modifyContent && (
        <div
          className=" is-flex is-align-items-center has-text-weight-bold"
          data-test={`textInfoStatus-${currentState}`}
        >
          <label>Accions:</label>&nbsp;&nbsp;
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
    </React.Fragment>
  )
}
