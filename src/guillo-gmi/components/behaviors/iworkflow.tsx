import { useTraversal } from '../../contexts'
import { Confirm } from '../modal'
import { useCrudContext } from '../../hooks/useCrudContext'
import { defineMessages, useIntl } from 'react-intl'
import { useEffect, useState } from 'react'

import { useVocabulary } from '../../hooks/useVocabulary'
import { get } from '../../lib/utils'
import { Workflow } from '../../types/guillotina'
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
  const { post, loading } = useCrudContext<Workflow>()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')
  const [definition, setDefinition] = useState<Workflow | undefined>(undefined)
  const [workflowAction, setWorkflowAction] = useState<string | undefined>(
    undefined
  )
  const vocabulary = useVocabulary('workflow_states')
  const currentState = Ctx.context[
    'guillotina.contrib.workflows.interfaces.IWorkflowBehavior'
  ]!['review_state']

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
    setWorkflowAction(undefined)
  }

  const getStateTitle = () => {
    if ((vocabulary.data?.items ?? []).length > 0) {
      const vocabularyValue = vocabulary?.data?.items.find(
        (item) => item.token === currentState
      )
      if (vocabularyValue) {
        const translatedValue = get(
          vocabularyValue,
          `title.translated_title.${intl.locale}`,
          null
        )
        if (translatedValue !== null) {
          return translatedValue
        }
        const titleValue = get(
          vocabularyValue,
          `title.title.${intl.locale}`,
          null
        )
        if (titleValue !== null) {
          return titleValue
        }
      }
    }
    return currentState
  }

  if (definition === undefined) return null

  return (
    <>
      {workflowAction && (
        <Confirm
          loading={loading}
          onCancel={() => setWorkflowAction(undefined)}
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
          {intl.formatMessage(messages.current_state, {
            state: getStateTitle(),
          })}
        </div>
      </div>
      {modifyContent && definition.transitions.length > 0 && (
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
                {get(
                  transition,
                  `metadata.translated_title.${intl.locale}`,
                  transition.title
                )}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
